package edu.nju.gyue.picket.model;

import java.util.Map;

public class ActivityModel {
    private String name;

    private String activityType;

    private String venueName;

    private String dateString;

    private String description;

    private long activityId;

    private String photo;

    private String venueCode;

    private String location;

    private String email;

    /**
     * 这里应为剩余座位的对应表，可以不精确
     */
    private Map<Double, Integer> priceMap;

    public Map<Double, Integer> getPriceMap() {
        return priceMap;
    }

    public void setPriceMap(Map<Double, Integer> priceMap) {
        this.priceMap = priceMap;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getDateString() {
        return dateString;
    }

    public void setDateString(String dateString) {
        this.dateString = dateString;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getActivityId() {
        return activityId;
    }

    public void setActivityId(long activityId) {
        this.activityId = activityId;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getVenueCode() {
        return venueCode;
    }

    public void setVenueCode(String venueCode) {
        this.venueCode = venueCode;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "ActivityModel{" + "name='" + name + '\'' + ", activityType='" + activityType + '\'' + ", venueName='"
                + venueName + '\'' + ", dateString='" + dateString + '\'' + ", description='" + description + '\'' +
                ", activityId=" + activityId + ", photo='" + photo + '\'' + ", venueCode='" + venueCode + '\'' + ", " +
                "location='" + location + '\'' + ", email='" + email + '\'' + ", priceMap=" + priceMap + '}';
    }
}
