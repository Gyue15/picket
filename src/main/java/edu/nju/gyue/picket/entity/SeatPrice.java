package edu.nju.gyue.picket.entity;

import javax.persistence.*;

@Entity
public class SeatPrice {

    @Id
    private String seatPriceId;

    private String seatId;

    private Double price;

    private Integer seatRow;

    private Integer seatColumn;

    private Boolean sold;

    private Integer areaCode;

    private String areaName;

    private String venueCode;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}, fetch = FetchType.EAGER)
    @JoinColumn(name = "activity_id")
    private Activity activity;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}, fetch = FetchType.EAGER)
    @JoinColumn(name = "activity_order_id")
    private ActivityOrder activityOrder;

    public String getSeatPriceId() {
        return seatPriceId;
    }

    public void setSeatPriceId(String seatPriceId) {
        this.seatPriceId = seatPriceId;
    }

    public Integer getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(Integer areaCode) {
        this.areaCode = areaCode;
    }

    public String getSeatId() {
        return seatId;
    }

    public void setSeatId(String seatId) {
        this.seatId = seatId;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getSeatRow() {
        return seatRow;
    }

    public void setSeatRow(Integer seatRow) {
        this.seatRow = seatRow;
    }

    public Integer getSeatColumn() {
        return seatColumn;
    }

    public void setSeatColumn(Integer seatColumn) {
        this.seatColumn = seatColumn;
    }

    public Boolean getSold() {
        return sold;
    }

    public void setSold(Boolean sold) {
        this.sold = sold;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public String getVenueCode() {
        return venueCode;
    }

    public void setVenueCode(String venueCode) {
        this.venueCode = venueCode;
    }

    public ActivityOrder getActivityOrder() {
        return activityOrder;
    }

    public void setActivityOrder(ActivityOrder activityOrder) {
        this.activityOrder = activityOrder;
    }

    @Override
    public String toString() {
        return "SeatPrice{" + "seatPriceId='" + seatPriceId + '\'' + ", seatId='" + seatId + '\'' + ", price=" +
                price + ", seatRow=" + seatRow + ", seatColumn=" + seatColumn + ", sold=" + sold + ", areaCode=" +
                areaCode + ", areaName='" + areaName + '\'' + ", venueCode='" + venueCode + '\'' + ", activity=" +
                activity + ", activityOrder=" + activityOrder + '}';
    }
}
