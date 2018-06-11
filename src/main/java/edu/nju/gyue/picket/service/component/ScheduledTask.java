package edu.nju.gyue.picket.service.component;

import edu.nju.gyue.picket.configuration.param.OrderState;
import edu.nju.gyue.picket.configuration.param.OrderType;
import edu.nju.gyue.picket.configuration.param.Param;
import edu.nju.gyue.picket.entity.*;
import edu.nju.gyue.picket.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class ScheduledTask {

    private final OrderRepository orderRepository;

    private final TicketRepository ticketRepository;

    private final SeatPriceRepository seatPriceRepository;

    private final PayAccountRepository payAccountRepository;

    private final ManagerRepository managerRepository;

    private final VenueRepository venueRepository;

    @Autowired
    public ScheduledTask(OrderRepository orderRepository, TicketRepository ticketRepository, SeatPriceRepository
            seatPriceRepository, PayAccountRepository payAccountRepository, ManagerRepository managerRepository,
                         VenueRepository venueRepository) {
        this.orderRepository = orderRepository;
        this.ticketRepository = ticketRepository;
        this.seatPriceRepository = seatPriceRepository;
        this.payAccountRepository = payAccountRepository;
        this.managerRepository = managerRepository;
        this.venueRepository = venueRepository;
    }

    @Scheduled(cron = "0 * * * * ?")
    public void updateOrder() {
        List<ActivityOrder> activityOrderList = orderRepository.findByOrderState(OrderState.UN_PAYED);
        activityOrderList.forEach(activityOrder -> {
            if (System.currentTimeMillis() - activityOrder.getPlaceDate().getTime() > Param.FIVE_MINS) {
                activityOrder.setOrderState(OrderState.CANCLED);
            }
        });
        orderRepository.save(activityOrderList);
        orderRepository.flush();
    }

    /*
    @Scheduled(cron = "0 * * * * ?")
    public void allocateTickets() {

        // 先获得2周之后的时间
        long time = System.currentTimeMillis();

        List<ActivityOrder> activityOrderList = orderRepository.findByOrderType(OrderType.NOT_SELECT);
        activityOrderList.forEach(order -> {

            if (!order.getOrderState().equals(OrderState.PAYED_AND_UNCHECK) || order.getBeginDate().getTime() - time
                    > Param.TWO_WEEK) {
                return;
            }
            List<SeatPrice> seatPriceList = seatPriceRepository.findByActivity_ActivityIdAndSoldAndPrice(order
                    .getActivity().getActivityId(), false, order.getUnitPrice());
            if (seatPriceList.size() == 0) {
                return;
            }

            List<Ticket> ticketList = new ArrayList<>();
            int size = Math.min(seatPriceList.size(), order.getSeatNum());
            List<String> seatPriceIds = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                SeatPrice seatPrice = seatPriceList.get(i);
                ticketList.add(generateTicket(seatPrice, order));
                seatPriceIds.add(seatPrice.getSeatPriceId());
            }
            order.setOrderType(OrderType.SELECTED);

            ticketRepository.save(ticketList);
            ticketRepository.flush();
            seatPriceRepository.lockSeats(seatPriceIds);

            // 退钱
            if (order.getSeatNum() - seatPriceList.size() > 0) {
                double price = order.getOrderValue() * (order.getSeatNum() - seatPriceList.size()) / order.getSeatNum();
                // member
                PayAccount payAccount = payAccountRepository.findOne(order.getPayAccountId());
                payAccount.setMoney(payAccount.getMoney() + price);

                // venue
                Venue venue = order.getVenue();
                venue.setPayMoney(venue.getPayMoney() - price * Param.MONEY_PERCENT);
                venue.setTickSales(venue.getTickSales() - price * Param.MONEY_PERCENT);

                // manager
                Manager manager = managerRepository.findOne("admin");
                manager.setMoney(manager.getMoney() - price);

                payAccountRepository.saveAndFlush(payAccount);
                venueRepository.saveAndFlush(venue);
                managerRepository.saveAndFlush(manager);
            }

        });
        orderRepository.save(activityOrderList);

    }
*/
    private Ticket generateTicket(SeatPrice seatPrice, ActivityOrder activityOrder) {
        Ticket ticket = new Ticket();
        ticket.setVenueName(activityOrder.getVenue().getVenueName());
        ticket.setSeatColumn(seatPrice.getSeatColumn());
        ticket.setSeatRow(seatPrice.getSeatRow());
        ticket.setIsUsed(false);
        ticket.setAreaName(seatPrice.getAreaName());
        ticket.setBeginTime(activityOrder.getBeginDate());
        ticket.setSeatId(seatPrice.getSeatId());
        ticket.setMember(activityOrder.getMember());
        ticket.setVenueCode(activityOrder.getVenue().getVenueCode());
        ticket.setActivityName(activityOrder.getActivity().getActivityName());
        ticket.setActivityOrder(activityOrder);
        ticket.setTicketId(-1L);
        return ticket;
    }


}
