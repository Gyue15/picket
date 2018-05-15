package edu.nju.gyue.picket.entity;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;

    private String activityName;

    private String seatId;

    private String areaName;

    private Integer seatRow;

    private Integer seatColumn;

    private Boolean isUsed;

    private String venueCode;

    private String venueName;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date beginTime;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}, fetch =
            FetchType.LAZY)
    @JoinColumn(name = "member_email")
    private Member member;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}, fetch =
            FetchType.LAZY)
    @JoinColumn(name = "activity_order_id")
    private ActivityOrder activityOrder;

    public String getSeatId() {
        return seatId;
    }

    public void setSeatId(String seatId) {
        this.seatId = seatId;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Date getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(Date beginTime) {
        this.beginTime = beginTime;
    }

    public Boolean getIsUsed() {
        return isUsed;
    }

    public void setIsUsed(Boolean used) {
        isUsed = used;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
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

    public ActivityOrder getActivityOrder() {
        return activityOrder;
    }

    public void setActivityOrder(ActivityOrder activityOrder) {
        this.activityOrder = activityOrder;
    }

    @Override
    public String toString() {
        return "Ticket{" + "ticketId=" + ticketId + ", activityName='" + activityName + '\'' + ", seatId='" + seatId
                + '\'' + ", areaName='" + areaName + '\'' + ", seatRow=" + seatRow + ", seatColumn=" + seatColumn +
                ", isUsed=" + isUsed + ", venueCode='" + venueCode + '\'' + ", venueName='" + venueName + '\'' + ", " +
                "beginTime=" + beginTime + '}';
    }
}
