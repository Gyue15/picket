package edu.nju.gyue.picket.model;

public class ManagerPayModel {

    private String venueName;

    private String unPayDateString;

    private Double tickSales;

    private Double payMoney;

    private String venueCode;

    public String getVenueCode() {
        return venueCode;
    }

    public void setVenueCode(String venueCode) {
        this.venueCode = venueCode;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getUnPayDateString() {
        return unPayDateString;
    }

    public void setUnPayDateString(String unPayDateString) {
        this.unPayDateString = unPayDateString;
    }

    public Double getTickSales() {
        return tickSales;
    }

    public void setTickSales(Double tickSales) {
        this.tickSales = tickSales;
    }

    public Double getPayMoney() {
        return payMoney;
    }

    public void setPayMoney(Double payMoney) {
        this.payMoney = payMoney;
    }

    @Override
    public String toString() {
        return "ManagerPayModel{" + "venueName='" + venueName + '\'' + ", unPayDateString='" + unPayDateString + '\'' + ", " +
                "tickSales=" + tickSales + ", payMoney=" + payMoney + ", venueCode='" + venueCode + '\'' + '}';
    }
}
