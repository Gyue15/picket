package edu.nju.gyue.picket.model;

import java.util.List;

public class StatisticManagerModel {
    private List<String> chartX;

    private List<Double> chartY;

    public StatisticManagerModel(List<String> chartX, List<Double> chartY) {
        this.chartX = chartX;
        this.chartY = chartY;
    }

    public StatisticManagerModel() {
    }

    public List<String> getChartX() {
        return chartX;
    }

    public void setChartX(List<String> chartX) {
        this.chartX = chartX;
    }

    public List<Double> getChartY() {
        return chartY;
    }

    public void setChartY(List<Double> chartY) {
        this.chartY = chartY;
    }

    @Override
    public String toString() {
        return "StatisticManagerModel{" + "chartX=" + chartX + ", chartY=" + chartY + '}';
    }
}
