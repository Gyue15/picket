package edu.nju.gyue.picket.model;

import java.util.List;
import java.util.Map;

public class StatisticVenueModel {

    private List<String> incomeX;

    private List<Double> incomeY;

    private Map<String, Integer> orderMap;

    private Double todayMoney;

    private Double moneyToPay;

    public StatisticVenueModel(List<String> incomeX, List<Double> incomeY, Map<String, Integer> orderMap, Double
            todayMoney, Double moneyToPay) {
        this.incomeX = incomeX;
        this.incomeY = incomeY;
        this.orderMap = orderMap;
        this.todayMoney = todayMoney;
        this.moneyToPay = moneyToPay;
    }

    public StatisticVenueModel() {
    }

    public List<String> getIncomeX() {
        return incomeX;
    }

    public void setIncomeX(List<String> incomeX) {
        this.incomeX = incomeX;
    }

    public List<Double> getIncomeY() {
        return incomeY;
    }

    public void setIncomeY(List<Double> incomeY) {
        this.incomeY = incomeY;
    }

    public Map<String, Integer> getOrderMap() {
        return orderMap;
    }

    public void setOrderMap(Map<String, Integer> orderMap) {
        this.orderMap = orderMap;
    }

    public Double getTodayMoney() {
        return todayMoney;
    }

    public void setTodayMoney(Double todayMoney) {
        this.todayMoney = todayMoney;
    }

    public Double getMoneyToPay() {
        return moneyToPay;
    }

    public void setMoneyToPay(Double moneyToPay) {
        this.moneyToPay = moneyToPay;
    }

    @Override
    public String toString() {
        return "StatisticVenueModel{" + "incomeX=" + incomeX + ", incomeY=" + incomeY + ", orderMap=" + orderMap + "," +
                " todayMoney=" + todayMoney + ", moneyToPay=" + moneyToPay + '}';
    }
}
