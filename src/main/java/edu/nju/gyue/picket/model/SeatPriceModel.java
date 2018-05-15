package edu.nju.gyue.picket.model;

import edu.nju.gyue.picket.configuration.param.Param;

public class SeatPriceModel {

    private String seatId;

    private Double price;

    private boolean sold;

    private String venueCode;

    private Integer areaCode;

    private String areaName;

    private Integer row;

    private Integer column;

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

    public boolean getSold() {
        return sold;
    }

    public void setSold(boolean sold) {
        this.sold = sold;
    }

    public String getSeatId() {
        return seatId;
    }

    public Integer getRow() {
        return row;
    }

    public void setRow(Integer row) {
        this.row = row;
    }

    public Integer getColumn() {
        return column;
    }

    public void setColumn(Integer column) {
        this.column = column;
    }

    public void setSeatId(String seatId) {
        String[] strings = seatId.split(Param.SPLIT_RE);
        venueCode = strings[0];
        areaCode = Integer.parseInt(strings[1]);
        row = Integer.parseInt(strings[2]);
        column = Integer.parseInt(strings[3]);
        areaName = strings[4];
        this.seatId = venueCode + "|" + areaCode + "|" + row + "|" + column;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    @Override
    public String toString() {
        return "SeatPriceModel{" + "seatId='" + seatId + '\'' + ", price=" + price + ", sold=" + sold + ", " +
                "venueCode='" + venueCode + '\'' + ", areaCode=" + areaCode + ", areaName='" + areaName + '\'' + ", " +
                "row=" + row + ", column=" + column + '}';
    }
}
