package edu.nju.gyue.picket.service.impl;

import edu.nju.gyue.picket.configuration.param.*;
import edu.nju.gyue.picket.entity.*;
import edu.nju.gyue.picket.exception.BadRequestException;
import edu.nju.gyue.picket.model.MemberPayModel;
import edu.nju.gyue.picket.model.SeatPriceModel;
import edu.nju.gyue.picket.repository.*;
import edu.nju.gyue.picket.service.PurchaseService;
import edu.nju.gyue.picket.service.component.TransferComponent;
import edu.nju.gyue.picket.util.MemberUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final SeatPriceRepository seatPriceRepository;

    private final OrderRepository orderRepository;

    private final TicketRepository ticketRepository;

    private final MemberRepository memberRepository;

    private final VenueRepository venueRepository;

    private final ManagerRepository managerRepository;

    private final ActivityRepository activityRepository;

    private final VoucherRepository voucherRepository;

    private final PayAccountRepository payAccountRepository;

    private final TransferComponent transferComponent;

    @Autowired
    public PurchaseServiceImpl(SeatPriceRepository seatPriceRepository, OrderRepository orderRepository,
                               TicketRepository ticketRepository, MemberRepository memberRepository, VenueRepository
                                           venueRepository, ManagerRepository managerRepository, ActivityRepository
                                           activityRepository, VoucherRepository voucherRepository,
                               PayAccountRepository payAccountRepository, TransferComponent transferComponent) {
        this.seatPriceRepository = seatPriceRepository;
        this.orderRepository = orderRepository;
        this.ticketRepository = ticketRepository;
        this.memberRepository = memberRepository;
        this.venueRepository = venueRepository;
        this.managerRepository = managerRepository;
        this.activityRepository = activityRepository;
        this.voucherRepository = voucherRepository;
        this.payAccountRepository = payAccountRepository;
        this.transferComponent = transferComponent;
    }

    @Override
    public List<SeatPriceModel> getSeatPriceList(String venueCode, Long activityId) {
        List<SeatPrice> seatPriceList = seatPriceRepository.findByActivity_ActivityId(activityId);

        return transferComponent.toSeatPriceModelList(seatPriceList);
    }

    @Override
    public List<Double> getPriceList(Long activityId) {
        List<SeatPrice> seatPriceList = seatPriceRepository.findByActivity_ActivityId(activityId);
        List<Double> priceList = new ArrayList<>();
        for (SeatPrice seatPrice : seatPriceList) {
            if (!priceList.contains(seatPrice.getPrice())) {
                priceList.add(seatPrice.getPrice());
            }
        }
        return priceList;
    }

    @Override
    public String placeOrderUnselect(Long activityId, Double unitPrice, Integer num, String email, String venueCode) {
        if (num <= 0 || num > Param.UNSELECT_MAX_NUM) {
            throw new BadRequestException("一次购买的座位数量应该大于0且不超过" + Param.UNSELECT_MAX_NUM + "座");
        }

        Member member = findMember(email);
        Venue venue = findVenue(venueCode);
        Activity activity = findActivity(activityId);


        List<SeatPrice> seatPriceList = seatPriceRepository.findByActivity_ActivityIdAndSoldAndPrice(activityId, false, unitPrice);
        if (seatPriceList.size() < num) {
            return "wrong";
        }


        List<String> seatPriceIds = new ArrayList<>();
        for (int i = 0; i < num; i++) {
            seatPriceIds.add(seatPriceList.get(i).getSeatPriceId());
        }
        seatPriceList = seatPriceList.subList(0, num);
        lockSeat(seatPriceList);
        seatPriceRepository.flush();

        ActivityOrder activityOrder = fillPlaceOrder(num, num * unitPrice, venue, OrderType.SELECTED, null,
                member, activity, seatPriceList);
        activityOrder = orderRepository.saveAndFlush(activityOrder);

        for (int i = 0; i < seatPriceList.size(); i++) {
            SeatPrice seatPrice = seatPriceList.get(i);
            seatPrice.setActivityOrder(activityOrder);
            seatPriceRepository.saveAndFlush(seatPrice);
        }

        return activityOrder.getOrderId().toString();
    }

    @Override
    @Transactional
    public String placeOrderSelect(Long activityId, List<SeatPriceModel> seatIdList, String email, String venueCode) {
        if (seatIdList.size() <= 0 || seatIdList.size() > Param.SELECT_MAX_NUM) {
            throw new BadRequestException("一次购买的座位数量应该大于0且不超过" + Param.SELECT_MAX_NUM + "座");
        }

        Member member = findMember(email);
        Venue venue = findVenue(venueCode);
        Activity activity = findActivity(activityId);

        // lock seat
        List<SeatPrice> seatPriceList = lockSeat(activityId, seatIdList);
        Double price = 0.0;
        System.out.println("0: " + seatPriceList);
        for (SeatPrice seatPrice : seatPriceList) {
            price += seatPrice.getPrice();
        }

        ActivityOrder activityOrder = fillPlaceOrder(seatIdList.size(), price, venue, OrderType.SELECTED, null,
                member, activity, seatPriceList);
        activityOrder = orderRepository.saveAndFlush(activityOrder);

        for (int i = 0; i < seatPriceList.size(); i++) {
            SeatPrice seatPrice = seatPriceList.get(i);
            seatPrice.setActivityOrder(activityOrder);
            seatPriceRepository.saveAndFlush(seatPrice);
        }


        return activityOrder.getOrderId().toString();
    }

    @Override
    @Transactional
    public String placeOrderOffLine(Long activityId, List<SeatPriceModel> seatIdList, String email, String venueCode) {
        double discount = 1;
        Member member = null;
        if (email != null) {
            member = findMember(email);
            discount = MemberUtil.getMemberDiscount(member.getLevel());
        }
        Venue venue = findVenue(venueCode);
        Activity activity = findActivity(activityId);

        // lock seat
        List<SeatPrice> seatPriceList = lockSeat(activityId, seatIdList);
        Double price = 0.0;
        for (SeatPrice seatPrice : seatPriceList) {
            price += seatPrice.getPrice();
        }

        ActivityOrder activityOrder = fillPlaceOrder(seatIdList.size(), price * discount, venue, OrderType.SELECTED,
                null, member, activity, seatPriceList);
        activityOrder = orderRepository.saveAndFlush(activityOrder);

        for (int i = 0; i < seatPriceList.size(); i++) {
            SeatPrice seatPrice = seatPriceList.get(i);
            seatPrice.setActivityOrder(activityOrder);
            seatPriceRepository.saveAndFlush(seatPrice);
        }

        return activityOrder.getOrderId().toString();
    }

    @Override
    @Transactional
    public void payOrder(String orderId, PayMethod payMethod, String payId, String password, String email, Long
            voucherId) {
        Member member = findMember(email);
        ActivityOrder activityOrder = findOrder(orderId);
        Voucher voucher = findVoucher(voucherId, activityOrder.getOrderValue(), email);
        Manager manager = managerRepository.findOne(Param.MANAGER_ACCOUNT);
        PayAccount payAccount = findPayAccount(payId, password, payMethod);
        Venue venue = activityOrder.getVenue();
        Activity activity = activityOrder.getActivity();

        Double price = activityOrder.getOrderValue() * MemberUtil.getMemberDiscount(member.getLevel());
        if (voucher != null) {
            price -= voucher.getDiscountMoney();
        }
        if (payAccount.getMoney() < price) {
            throw new BadRequestException("账户余额不足");
        }

        // member
        payAccount.setMoney(payAccount.getMoney() - price);
<<<<<<< HEAD
<<<<<<< HEAD
        activityOrder.setOrderState(OrderState.PAID_AND_UNMAIL);
=======
        activityOrder.setOrderState(OrderState.PAID);
>>>>>>> 11a383bb01d3dbe5ce6769dcc64bd5dad7a16a51
=======
        activityOrder.setOrderState(OrderState.PAID);
>>>>>>> 11a383bb01d3dbe5ce6769dcc64bd5dad7a16a51
        activityOrder.setOrderValue(price);
        activityOrder.setIsPaid(true);
        activityOrder.setPayAccountId(payId);
        int point = member.getPoint() + (int) (price * Param.MONEY_PER_POINT);
        int level = MemberUtil.getMemberLevel(point);
        member.setPoint(point);
        member.setLevel(member.getLevel() > level ? member.getLevel() : level);

        // ticket
        List<Ticket> ticketList = new ArrayList<>();
        activityOrder.getSeatPriceList().forEach(seatPrice -> {
            Ticket ticket = new Ticket();
            ticket.setActivityName(activity.getActivityName());
            ticket.setVenueCode(venue.getVenueCode());
            ticket.setMember(member);
            ticket.setSeatId(seatPrice.getSeatId());
            ticket.setBeginTime(activityOrder.getBeginDate());
            ticket.setAreaName(seatPrice.getAreaName());
            ticket.setIsUsed(false);
            ticket.setSeatRow(seatPrice.getSeatRow());
            ticket.setSeatColumn(seatPrice.getSeatColumn());
            ticket.setVenueName(venue.getVenueName());
            ticket.setActivityOrder(activityOrder);
            ticketList.add(ticket);
        });

        // venue
        venue.setPayMoney(venue.getPayMoney() + price * Param.MONEY_PERCENT);
        venue.setTickSales(venue.getTickSales() + price);
        if (venue.getUnPayDate() == null) {
            venue.setUnPayDate(new Date());
        }

        // manager
        manager.setMoney(manager.getMoney() + price);

        // save
        payAccountRepository.save(payAccount);
        ticketRepository.save(ticketList);
        activityOrder.setTicketList(ticketList);
        orderRepository.save(activityOrder);
        venueRepository.save(venue);
        managerRepository.save(manager);
        memberRepository.save(member);
    }

    @Override
    public void cancelPay(String orderId, String email) {
        ActivityOrder activityOrder = findOrder(orderId);
        if (!activityOrder.getMember().getEmail().equals(email)) {
            throw new BadRequestException("订单与用户不符");
        }
        List<SeatPrice> seatPriceList = activityOrder.getSeatPriceList();
        seatPriceList.forEach(seatPrice -> {
            seatPrice.setSold(false);
            seatPrice.setActivityOrder(null);
        });
        activityOrder.setSeatPriceList(new ArrayList<>());
        activityOrder.setOrderState(OrderState.CANCELLED);

        orderRepository.save(activityOrder);
        seatPriceRepository.save(seatPriceList);
    }

    @Override
    public MemberPayModel getPayMessage(String email, String orderId) {
        Member member = findMember(email);
        ActivityOrder activityOrder = findOrder(orderId);
        MemberPayModel memberPayModel = new MemberPayModel();
        memberPayModel.setMemberDiscount(MemberUtil.getMemberDiscount(member.getLevel()));
        memberPayModel.setMoney(activityOrder.getOrderValue());
        memberPayModel.setVoucherModelList(transferComponent.toVoucherModelList(voucherRepository
                .findByMember_EmailAndIsUsedAndLeastMoneyLessThanEqualAndLeastDateAfter(email, false, activityOrder
                        .getOrderValue(), new Date())));
        return memberPayModel;
    }

    @Override
    public Date getPlaceDate(String orderId) {
        ActivityOrder activityOrder = findOrder(orderId);
        return activityOrder.getPlaceDate();
    }

    private ActivityOrder fillPlaceOrder(Integer seatNum, Double orderValue, Venue venue, OrderType orderType, Double
            unitPrice, Member member, Activity activity, List<SeatPrice> seatPriceList) {
        ActivityOrder activityOrder = new ActivityOrder();
        activityOrder.setSeatNum(seatNum);
        activityOrder.setOrderValue(orderValue);
        activityOrder.setPlaceDate(new Date());
        activityOrder.setVenue(venue);
        activityOrder.setOrderType(orderType);
        activityOrder.setUnitPrice(unitPrice);
        activityOrder.setOrderState(OrderState.UN_PAID);
        activityOrder.setBeginDate(activity.getBeginDate());
        activityOrder.setIsPaid(false);
        activityOrder.setMember(member);
        activityOrder.setActivity(activity);
        activityOrder.setPayAccountId(null);
        activityOrder.setSeatPriceList(seatPriceList);
        return activityOrder;
    }

    private synchronized List<SeatPrice> lockSeat(Long activityId, List<SeatPriceModel> seatIdList) {
        List<String> seatPriceIdList = new ArrayList<>();
        seatIdList.forEach(seatPriceModel -> seatPriceIdList.add(activityId + Param.SPLIT + seatPriceModel.getSeatId
                ()));
        List<SeatPrice> seatPriceList = seatPriceRepository.findAll(seatPriceIdList);
        for (SeatPrice seatPrice : seatPriceList) {
            if (seatPrice.getSold()) {
                throw new BadRequestException("座位已被占用");
            }
            seatPrice.setSold(true);
        }
        seatPriceRepository.save(seatPriceList);
        seatPriceRepository.flush();
        return seatPriceList;
    }

    private synchronized void lockSeat(List<SeatPrice> seatPriceList) {
        for (SeatPrice seatPrice : seatPriceList) {
            if (seatPrice.getSold()) {
                throw new BadRequestException("座位已被占用");
            }
            seatPrice.setSold(true);
        }
        seatPriceRepository.save(seatPriceList);
        seatPriceRepository.flush();
    }

    private PayAccount findPayAccount(String payAccountId, String payPassword, PayMethod payMethod) {
        PayAccount payAccount = payAccountRepository.findByAccountIdAndPassword(payAccountId, payPassword);
        if (payAccount == null || payAccount.getAccountId() == null || !payAccount.getPayMethod().equals(payMethod)) {
            throw new BadRequestException("支付账号或密码错误");
        }
        return payAccount;
    }

    private Voucher findVoucher(Long voucherId, Double orderValue, String email) {
        Voucher voucher = voucherRepository.findOne(voucherId);
        if (voucher == null) {
            return null;
        }
        if (orderValue < voucher.getDiscountMoney()) {
            throw new BadRequestException("订单金额不够使用该优惠券");
        }
        if (voucher.getLeastDate().getTime() < System.currentTimeMillis()) {
            throw new BadRequestException("该优惠券已过期");
        }
        if (!voucher.getMember().getEmail().equals(email)) {
            throw new BadRequestException("无权使用该优惠券");
        }
        return voucher;

    }

    private ActivityOrder findOrder(String orderId) {
        ActivityOrder activityOrder = orderRepository.findOne(Long.parseLong(orderId));
        if (activityOrder.getIsPaid()) {
            throw new BadRequestException("订单已经支付");
        }
        return activityOrder;
    }

    private Member findMember(String email) {
        Member member = memberRepository.findOne(email);
        if (member == null || member.getEmail() == null) {
            throw new BadRequestException("用户邮箱错误");
        }
        if (member.getValid().equals(MemberState.ABOLISHED)) {
            throw new BadRequestException("该用户已停止账户");
        }
        if (member.getValid().equals(MemberState.NOT_VERIFY)) {
            throw new BadRequestException("该用户还没有验证邮箱");
        }
        return member;

    }

    private Venue findVenue(String venueCode) {
        Venue venue = venueRepository.findOne(venueCode);
        if (venue == null || venue.getVenueCode() == null) {
            throw new BadRequestException("场馆编码错误");
        }
        return venue;
    }

    private Activity findActivity(Long activityId) {
        Activity activity = activityRepository.findOne(activityId);
        if (activity == null || activity.getActivityId() == null) {
            throw new BadRequestException("活动编码有误");
        }
        return activity;
    }
}
