package edu.nju.gyue.picket.model;

import java.util.Date;

public class TicketModel {

    private String activityName;

    private String venueName;

    private String seat;

    private Date beginTime;

    private String ticketCode;

    private Boolean checked;

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getSeat() {
        return seat;
    }

    public void setSeat(String seat) {
        this.seat = seat;
    }

    public Date getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(Date beginTime) {
        this.beginTime = beginTime;
    }

    public String getTicketCode() {
        return ticketCode;
    }

    public void setTicketCode(String ticketCode) {
        this.ticketCode = ticketCode;
    }

    public Boolean getChecked() {
        return checked;
    }

    public void setChecked(Boolean checked) {
        this.checked = checked;
    }

    @Override
    public String toString() {
        return "TicketModel{" + "activityName='" + activityName + '\'' + ", venueName='" + venueName + '\'' + ", " +
                "seat='" + seat + '\'' + ", beginTime=" + beginTime + ", ticketCode='" + ticketCode + '\'' + ", " +
                "checked=" + checked + '}';
    }
}
