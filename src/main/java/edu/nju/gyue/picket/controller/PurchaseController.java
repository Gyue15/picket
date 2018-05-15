package edu.nju.gyue.picket.controller;

import com.alibaba.fastjson.JSON;
import edu.nju.gyue.picket.configuration.param.PayMethod;
import edu.nju.gyue.picket.model.MemberPayModel;
import edu.nju.gyue.picket.model.SeatPriceModel;
import edu.nju.gyue.picket.service.PurchaseService;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/activities", produces = "application/json;charset=UTF-8")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    /**
     * 获得支付界面显示的信息
     *
     * @param email     用户email
     * @param signature 支付凭证或锁
     * @return 支付界面需要的信息
     */
    @GetMapping("/pay-messages")
    public MemberPayModel getPayMessage(@RequestParam String email, @RequestParam String signature) {
        return purchaseService.getPayMessage(email, signature);
    }


    @PostMapping("/place-order/un-select")
    public Map<String, String> placeOrderUnselect(Long activityId, Double unitPrice, Integer num, String email,
                                                  String venueCode) {
        Map<String, String> res = new HashMap<>();
        res.put("orderId", purchaseService.placeOrderUnselect(activityId, unitPrice, num, email, venueCode));
        return res;
    }

    @PostMapping("/place-order/select")
    public Map<String, String> placeOrderSelect(Long activityId, String seatIdListString, String email, String
            venueCode) {
        List<SeatPriceModel> seatPriceModelList = JSON.parseArray(seatIdListString, SeatPriceModel.class);
        Map<String, String> res = new HashMap<>();
        res.put("orderId", purchaseService.placeOrderSelect(activityId, seatPriceModelList, email, venueCode));
        return res;
    }

    @PostMapping("/place-order/off-line")
    public Map<String, String> placeOrderOffLine(Long activityId, String seatIdListString, String email, String
            venueCode) {
        List<SeatPriceModel> seatPriceModelList = JSON.parseArray(seatIdListString, SeatPriceModel.class);
        Map<String, String> res = new HashMap<>();
        res.put("orderId", purchaseService.placeOrderOffLine(activityId, seatPriceModelList, email, venueCode));
        return res;
    }

    @PostMapping("/pay-order")
    public void payOrder(String orderId, PayMethod payMethod, String payId, String password, String email, Long
            voucherId) {
        purchaseService.payOrder(orderId, payMethod, payId, password, email, voucherId);
    }

    @PostMapping("/pay-cancel")
    public void cancelPay(String orderId, String email) {
        purchaseService.cancelPay(orderId, email);
    }

    /**
     * 获得某一活动的座位价格表
     *
     * @param venueCode  场馆编号
     * @param activityId 活动id
     * @return 座位价格对应表
     */
    @GetMapping("/seat-prices")
    public List<SeatPriceModel> getSeatPriceList(@RequestParam("venue-code") String venueCode, @RequestParam
            ("activity-id") Long activityId) {
        return purchaseService.getSeatPriceList(venueCode, activityId);
    }

    /**
     * 获得一个活动的价格区间
     *
     * @param activityId 活动id
     * @return 价格区间列表
     */
    @GetMapping("/prices")
    public List<Double> getPriceList(Long activityId) {
        return purchaseService.getPriceList(activityId);
    }

    @GetMapping("/place-date")
    public Date getPlaceDate(@RequestParam("order-id") String orderId) {
        return purchaseService.getPlaceDate(orderId);
    }
}
