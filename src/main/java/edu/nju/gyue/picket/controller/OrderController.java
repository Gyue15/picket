package edu.nju.gyue.picket.controller;

import edu.nju.gyue.picket.configuration.param.OrderState;
import edu.nju.gyue.picket.configuration.param.OrderType;
import edu.nju.gyue.picket.configuration.param.UserType;
import edu.nju.gyue.picket.exception.BadRequestException;
import edu.nju.gyue.picket.model.OrderModel;
import edu.nju.gyue.picket.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/orders", produces = "application/json;charset=UTF-8")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/check")
    public Map<String, String> checkTicket(String ticketCode, String venueCode) {
        System.out.println("ticketCode: " + ticketCode + ", venueCode: " + venueCode);
        Map<String, String> res = new HashMap<>();
        res.put("message", "success");
        res.put("activityName", orderService.checkTicket(ticketCode, venueCode));
        return res;
    }

    @GetMapping
    public List<OrderModel> getOrderList(@RequestParam String id, @RequestParam("user-type") UserType userType,
                                         @RequestParam("page") Integer pageNum, @RequestParam("page-size") Integer
                                                     pageSize,@RequestParam("order-state") OrderState orderState) {
        System.out.println("id: " + id + ", userType: " + userType + ", page: " + pageNum + ", pageSize: " + pageSize);
        switch (userType) {
            case MEMBER:
                return orderService.getMemberOrderList(id, pageNum, pageSize, orderState);
            case VENUE:
                return orderService.getVenueOrderList(id, pageNum, pageSize);
            default:
                throw new BadRequestException("不支持这种用户类型");
        }
    }

    @GetMapping("/{order-id}")
    public OrderModel getOrder(@PathVariable("order-id") String orderId) {
        System.out.println("orderId: " + orderId);
        return orderService.getOrder(orderId);
    }

    @GetMapping("/page-numbers")
    public Integer getPageNum(@RequestParam("user-type") UserType userType, @RequestParam String id, @RequestParam
            ("page-size") Integer pageSize,@RequestParam("order-state") OrderState orderState) {
        System.out.println("getPageNum activity: " + userType + ", id: " + id + ", pageSize: " + pageSize);
        switch (userType) {
            case MEMBER:
                return orderService.getMemberPageNum(id, pageSize, orderState);
            case VENUE:
                return orderService.getVenuePageNum(id, pageSize);
            default:
                throw new BadRequestException("不支持这种用户类型");
        }
    }

    @PostMapping("/cancel")
    public void cancelOrder(String orderId) {
        System.out.println("orderId: " + orderId);
        orderService.cancelOrder(orderId);
    }



//    private OrderModel fakeOrder(String orderId) {
//        OrderModel orderModel = new OrderModel();
//        orderModel.setActivityName("阿尔托莉雅开饭了");
//        orderModel.setOrderId(orderId);
//        orderModel.setOrderState("已完成");
//        orderModel.setOrderValue(120.0);
//        orderModel.setPlaceDateString("2018年2月1日 6:23:12");
//        orderModel.setVenueName("南京大剧院");
//        orderModel.setBeginDateString("2018年3月1日 21:00:00");
//        List<String> seatString = new ArrayList<>();
//        seatString.add("A区7排1座");
//        seatString.add("A区7排2座");
//        orderModel.setSeats(seatString);
//        orderModel.setCanCancel(true);
//        return orderModel;
//    }
//
//    private List<OrderModel> fakeOrderList() {
//        List<OrderModel> orderModelList = new ArrayList<>();
//        for (int i = 0; i < 5; i++) {
//            orderModelList.add(fakeOrder("0000000000" + i));
//        }
//        return orderModelList;
//    }
}
