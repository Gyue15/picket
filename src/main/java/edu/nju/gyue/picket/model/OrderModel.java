package edu.nju.gyue.picket.model;

import edu.nju.gyue.picket.configuration.param.OrderState;

public class OrderModel {

    private String activityName;

    private String orderId;

    private String placeDateString;

    private String beginDateString;

    private Double orderValue;

    private String orderState;

    private String venueName;

    private Boolean canCancel;

    private Integer seats;

    private OrderState orignState;

    private Boolean lock;

    public Boolean getCanCancel() {
        return canCancel;
    }

    public void setCanCancel(Boolean canCancel) {
        this.canCancel = canCancel;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getPlaceDateString() {
        return placeDateString;
    }

    public void setPlaceDateString(String placeDateString) {
        this.placeDateString = placeDateString;
    }

    public String getBeginDateString() {
        return beginDateString;
    }

    public void setBeginDateString(String beginDateString) {
        this.beginDateString = beginDateString;
    }

    public Double getOrderValue() {
        return orderValue;
    }

    public void setOrderValue(Double orderValue) {
        this.orderValue = orderValue;
    }

    public String getOrderState() {
        return orderState;
    }

    public void setOrderState(String orderState) {
        this.orderState = orderState;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    public OrderState getOrignState() {
        return orignState;
    }

    public void setOrignState(OrderState orignState) {
        this.orignState = orignState;
    }

    public Boolean getLock() {
        return lock;
    }

    public void setLock(Boolean lock) {
        this.lock = lock;
    }

    @Override
    public String toString() {
        return "OrderModel{" + "activityName='" + activityName + '\'' + ", orderId='" + orderId + '\'' + ", " +
                "placeDateString='" + placeDateString + '\'' + ", beginDateString='" + beginDateString + '\'' + ", "
                + "orderValue=" + orderValue + ", orderState='" + orderState + '\'' + ", venueName='" + venueName +
                '\'' + ", canCancel=" + canCancel + ", seats=" + seats + '}';
    }
}
