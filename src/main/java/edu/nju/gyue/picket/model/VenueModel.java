package edu.nju.gyue.picket.model;

public class   VenueModel {

    private String venueCode;

    private String venueName;

    private String location;

    private String detail;

    private String email;

    private boolean inCheck;

    private String checkTimeString;

    public String getCheckTimeString() {
        return checkTimeString;
    }

    public void setCheckTimeString(String checkTimeString) {
        this.checkTimeString = checkTimeString;
    }

    public boolean getInCheck() {
        return inCheck;
    }

    public void setInCheck(boolean inCheck) {
        this.inCheck = inCheck;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
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

    @Override
    public String toString() {
        return "VenueModel{" + "venueCode='" + venueCode + '\'' + ", venueName='" + venueName + '\'' + ", location='"
                + location + '\'' + ", detail='" + detail + '\'' + ", email='" + email + '\'' + ", inCheck=" +
                inCheck + ", checkTimeString='" + checkTimeString + '\'' + '}';
    }
}
