package edu.nju.gyue.picket.model;

import java.util.Map;

public class StatisticMemberModel {
    private Map<String, Integer> consumeType;

    private Map<String, Double> consumeStatistic;

    private Map<String, Integer> orderStatistic;

    public StatisticMemberModel(Map<String, Integer> consumeType, Map<String, Double> consumeStatistic, Map<String,
            Integer> orderStatistic) {
        this.consumeType = consumeType;
        this.consumeStatistic = consumeStatistic;
        this.orderStatistic = orderStatistic;
    }

    public StatisticMemberModel() {
    }

    public Map<String, Integer> getConsumeType() {
        return consumeType;
    }

    public void setConsumeType(Map<String, Integer> consumeType) {
        this.consumeType = consumeType;
    }

    public Map<String, Double> getConsumeStatistic() {
        return consumeStatistic;
    }

    public void setConsumeStatistic(Map<String, Double> consumeStatistic) {
        this.consumeStatistic = consumeStatistic;
    }

    public Map<String, Integer> getOrderStatistic() {
        return orderStatistic;
    }

    public void setOrderStatistic(Map<String, Integer> orderStatistic) {
        this.orderStatistic = orderStatistic;
    }

    @Override
    public String toString() {
        return "StatisticMemberModel{" + "consumeType=" + consumeType + ", consumeStatistic=" + consumeStatistic + "," +
                " orderStatistic=" + orderStatistic + '}';
    }
}
