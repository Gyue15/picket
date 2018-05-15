package edu.nju.gyue.picket.entity;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class Venue {

    @Id
    private String venueCode;

    private String venueName;

    private String password;

    private String email;

    private String detail;

    private String location;

    private String seatGraphUrl;

    private String areaGraphUrl;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date unPayDate;

    /**
     * 既上次经理支付后，场馆售出的票款
     */
    private Double tickSales;

    /**
     * 经理还需支付给场馆的钱，本例中为ticketSales * 0.7
     */
    private Double payMoney;

    private Boolean inCheck;

    private Date signDate;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "venue")
    private List<Activity> activityList;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "venue")
    private List<VenueMessage> venueMessageList;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "venue")
    private List<ActivityOrder> activityOrderList;

    public Boolean getInCheck() {
        return inCheck;
    }

    public void setInCheck(Boolean inCheck) {
        this.inCheck = inCheck;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getUnPayDate() {
        return unPayDate;
    }

    public void setUnPayDate(Date unPayDate) {
        this.unPayDate = unPayDate;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSeatGraphUrl() {
        return seatGraphUrl;
    }

    public void setSeatGraphUrl(String seatGraphUrl) {
        this.seatGraphUrl = seatGraphUrl;
    }

    public String getAreaGraphUrl() {
        return areaGraphUrl;
    }

    public void setAreaGraphUrl(String areaGraphUrl) {
        this.areaGraphUrl = areaGraphUrl;
    }

    public List<Activity> getActivityList() {
        return activityList;
    }

    public void setActivityList(List<Activity> activityList) {
        this.activityList = activityList;
    }

    public List<VenueMessage> getVenueMessageList() {
        return venueMessageList;
    }

    public void setVenueMessageList(List<VenueMessage> venueMessageList) {
        this.venueMessageList = venueMessageList;
    }

    public List<ActivityOrder> getActivityOrderList() {
        return activityOrderList;
    }

    public void setActivityOrderList(List<ActivityOrder> activityOrderList) {
        this.activityOrderList = activityOrderList;
    }

    public Date getSignDate() {
        return signDate;
    }

    public void setSignDate(Date signDate) {
        this.signDate = signDate;
    }
}
