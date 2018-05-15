package edu.nju.gyue.picket.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import edu.nju.gyue.picket.configuration.param.CheckType;

import javax.persistence.*;
import java.util.Date;

@Entity
public class VenueCheck {
    @Id
    private String venueCode;

    private String venueName;

    private String email;

    private String password;

    private String detail;

    private String location;

    private String seatGraphUrl;

    private String areaGraphUrl;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date checkTime;

    private Boolean inCheck;

    @Enumerated(EnumType.STRING)
    private CheckType checkType;

    public CheckType getCheckType() {
        return checkType;
    }

    public void setCheckType(CheckType checkType) {
        this.checkType = checkType;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public Date getCheckTime() {
        return checkTime;
    }

    public void setCheckTime(Date checkTime) {
        this.checkTime = checkTime;
    }

    public Boolean getInCheck() {
        return inCheck;
    }

    public void setInCheck(Boolean inCheck) {
        this.inCheck = inCheck;
    }
}
