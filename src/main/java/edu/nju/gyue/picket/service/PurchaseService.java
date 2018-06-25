package edu.nju.gyue.picket.service;

import edu.nju.gyue.picket.configuration.param.PayMethod;
import edu.nju.gyue.picket.model.MemberPayModel;
import edu.nju.gyue.picket.model.SeatPriceModel;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface PurchaseService {

    List<SeatPriceModel> getSeatPriceList(String venueCode, Long activityId);

    List<Double> getPriceList(Long activityId);

    String placeOrderUnselect(Long activityId, Double unitPrice, Integer num, String email, String
            venueCode);

    String placeOrderSelect(Long activityId, List<SeatPriceModel> seatIdList, String email, String venueCode);

    String placeOrderOffLine(Long activityId, List<SeatPriceModel> seatIdList, String email, String venueCode);

    void payOrder(String orderId, PayMethod payMethod, String payId, String password, String email, Long voucherId);

    int cancelPay(String orderId, String email);

    MemberPayModel getPayMessage(String email, String orderId);

    Date getPlaceDate(String orderId);

}
