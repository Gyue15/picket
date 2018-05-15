package edu.nju.gyue.picket.service;

import edu.nju.gyue.picket.configuration.param.OrderState;
import edu.nju.gyue.picket.model.OrderModel;

import java.util.List;

public interface OrderService {

    String checkTicket(String ticketCode, String venueCode);

    List<OrderModel> getMemberOrderList(String email, Integer pageNum, Integer pageSize, OrderState orderState);

    List<OrderModel> getVenueOrderList(String venueCode, Integer pageNum, Integer pageSize);

    OrderModel getOrder(String orderId);

    Integer getMemberPageNum(String email, Integer pageSize, OrderState orderState);

    Integer getVenuePageNum(String venueCode, Integer pageSize);

    void cancelOrder(String orderId);


}
