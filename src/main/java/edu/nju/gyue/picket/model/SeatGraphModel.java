package edu.nju.gyue.picket.model;

public class SeatGraphModel {
    private Integer areaCode;

    private String seatGraph;

    private String venueCode;

    private String areaName;

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

    public Integer getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(Integer areaCode) {
        this.areaCode = areaCode;
    }

    public String getSeatGraph() {
        return seatGraph;
    }

    public void setSeatGraph(String seatGraph) {
        this.seatGraph = seatGraph;
    }

    @Override
    public String toString() {
        return "SeatGraphModel{" + "areaCode=" + areaCode + ", seatGraph='" + seatGraph + '\'' + ", venueCode='" +
                venueCode + '\'' + ", areaName='" + areaName + '\'' + '}';
    }

}
