package edu.nju.gyue.picket.service.impl;

import edu.nju.gyue.picket.configuration.param.OrderState;
import edu.nju.gyue.picket.configuration.param.Param;
import edu.nju.gyue.picket.entity.*;
import edu.nju.gyue.picket.exception.BadRequestException;
import edu.nju.gyue.picket.model.OrderModel;
import edu.nju.gyue.picket.repository.*;
import edu.nju.gyue.picket.service.OrderService;
import edu.nju.gyue.picket.service.component.TransferComponent;
import edu.nju.gyue.picket.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final TicketRepository ticketRepository;

    private final PayAccountRepository payAccountRepository;

    private final VenueRepository venueRepository;

    private final ManagerRepository managerRepository;


    private final SeatPriceRepository seatPriceRepository;

    private final TransferComponent transferComponent;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository, TicketRepository ticketRepository, PayAccountRepository
            payAccountRepository, VenueRepository venueRepository, ManagerRepository managerRepository,
                            SeatPriceRepository seatPriceRepository, TransferComponent transferComponent) {
        this.orderRepository = orderRepository;
        this.ticketRepository = ticketRepository;
        this.payAccountRepository = payAccountRepository;
        this.venueRepository = venueRepository;
        this.managerRepository = managerRepository;
        this.seatPriceRepository = seatPriceRepository;
        this.transferComponent = transferComponent;
    }


    @Override
    public String checkTicket(String ticketCode, String venueCode) {
        Ticket ticket = ticketRepository.findOne(Long.parseLong(ticketCode));
        if (ticket == null || !ticket.getVenueCode().equals(venueCode)) {
            throw new BadRequestException("取票号有误");
        }
        if (ticket.getIsUsed()) {
            throw new BadRequestException("该票已经使用过了");
        }
        ticket.setIsUsed(true);
        ticket.getActivityOrder().setOrderState(OrderState.PAID_AND_MAIL);
        ticketRepository.saveAndFlush(ticket);
        return ticket.getActivityName();
    }

    @Override
    public List<OrderModel> getMemberOrderList(String email, OrderState orderState) {
    	int pageSize = orderRepository.countByMember_EmailAndOrderState(email, orderState)==0 ? 1 : orderRepository.countByMember_EmailAndOrderState(email, orderState);
        Pageable pageable = new PageRequest(0, pageSize, Sort.Direction.DESC, "placeDate");
        Page<ActivityOrder> orderPage = orderRepository.findByMember_EmailAndOrderState(email, pageable, orderState);
        return transferComponent.toOrderModelList(orderPage.getContent());
    }

    @Override
    public List<OrderModel> getVenueOrderList(String venueCode, Integer pageNum, Integer pageSize) {
        Pageable pageable = new PageRequest(pageNum - 1, pageSize, Sort.Direction.DESC, "placeDate");
        Page<ActivityOrder> orderPage = orderRepository.findByVenue_VenueCode(venueCode, pageable);
        return transferComponent.toOrderModelList(orderPage.getContent());
    }

    @Override
    public OrderModel getOrder(String orderId) {
        return transferComponent.toModel(orderRepository.findOne(Long.parseLong(orderId)));
    }

    @Override
    public Integer getMemberPageNum(String email, Integer pageSize, OrderState orderState) {
        Integer num = orderRepository.countByMember_EmailAndOrderState(email, orderState);
        return (num + pageSize - 1) / pageSize;
    }

    @Override
    public Integer getVenuePageNum(String venueCode, Integer pageSize) {
        Integer num = orderRepository.countByVenue_VenueCode(venueCode);
        return (num + pageSize - 1) / pageSize;
    }

    @Override
    @Transactional
    public void cancelOrder(String orderId) {
        // activityOrder
        ActivityOrder activityOrder = orderRepository.findOne(Long.parseLong(orderId));
        if (activityOrder == null || activityOrder.getOrderId() == null) {
            throw new BadRequestException("订单编号错误");
        }

        if (!activityOrder.getOrderState().equals(OrderState.PAID_AND_UNMAIL)) {
            throw new BadRequestException("该订单无法退订");
        }

        activityOrder.setOrderState(OrderState.CANCELLED);
//        activityOrder = orderRepository.saveAndFlush(activityOrder);

        // 解锁座位
        List<SeatPrice> seatPriceList = activityOrder.getSeatPriceList();
        seatPriceList.forEach(seatPrice -> {
            seatPrice.setSold(false);
            seatPrice.setActivityOrder(null);
        });
        activityOrder.setSeatPriceList(null);

        // 删除ticket
        List<Ticket> ticketList = activityOrder.getTicketList();
        activityOrder.setTicketList(new ArrayList<>());

        // 退钱
        String payId = activityOrder.getPayAccountId();
        PayAccount payAccount = payAccountRepository.findOne(payId);
        // 判断需要退多少钱
        double returnPercent = getReturnMoney(DateUtil.getPeriodDate(activityOrder.getBeginDate(), new Date()));
        if (returnPercent == 0.0) {
            throw new BadRequestException("该订单无法退订");
        }
        payAccount.setMoney(payAccount.getMoney() + activityOrder.getOrderValue() * returnPercent);
//        payAccountRepository.saveAndFlush(payAccount);

        // 扣场馆的钱
        Venue venue = activityOrder.getVenue();
        venue.setTickSales(venue.getTickSales() - activityOrder.getOrderValue() * returnPercent);
        venue.setPayMoney(venue.getPayMoney() - activityOrder.getOrderValue() * returnPercent);

        // 扣manager的钱
        Manager manager = managerRepository.findOne(Param.MANAGER_ACCOUNT);
        manager.setMoney(manager.getMoney() - activityOrder.getOrderValue() * returnPercent);
//        venueRepository.save(venue);

        orderRepository.save(activityOrder);
        seatPriceRepository.save(seatPriceList);
        ticketRepository.delete(ticketList);
        payAccountRepository.save(payAccount);
        venueRepository.save(venue);
        managerRepository.save(manager);

    }

    private double getReturnMoney(int dateNum) {
        int level = Param.RETURN_LEVEL.length - 1;
        for (int i = 0; i < Param.DAY_LEVEL.length; i++) {
            if (Param.DAY_LEVEL[i] >= dateNum) {
                level = i;
                break;
            }
        }
        return Param.RETURN_LEVEL[level];
    }
}
