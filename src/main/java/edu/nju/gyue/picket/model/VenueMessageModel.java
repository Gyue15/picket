package edu.nju.gyue.picket.model;

public class VenueMessageModel {
    private String titleString;

    private String bodyString;

    private Boolean needDisplay;

    public String getTitleString() {
        return titleString;
    }

    public void setTitleString(String titleString) {
        this.titleString = titleString;
    }

    public String getBodyString() {
        return bodyString;
    }

    public void setBodyString(String bodyString) {
        this.bodyString = bodyString;
    }

    public Boolean getNeedDisplay() {
        return needDisplay;
    }

    public void setNeedDisplay(Boolean needDisplay) {
        this.needDisplay = needDisplay;
    }

    @Override
    public String toString() {
        return "VenueMessageModel{" + "titleString='" + titleString + '\'' + ", bodyString='" + bodyString + '\'' +
                ", needDisplay=" + needDisplay + '}';
    }
}
