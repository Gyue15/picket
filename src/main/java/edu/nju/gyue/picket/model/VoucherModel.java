package edu.nju.gyue.picket.model;

import java.util.Date;

public class VoucherModel {

    private Double leastMoney;

    private Double discountMoney;

    private Long voucherId;

    private Date leastDate;

    public Double getLeastMoney() {
        return leastMoney;
    }

    public void setLeastMoney(Double leastMoney) {
        this.leastMoney = leastMoney;
    }

    public Double getDiscountMoney() {
        return discountMoney;
    }

    public void setDiscountMoney(Double discountMoney) {
        this.discountMoney = discountMoney;
    }

    public Long getVoucherId() {
        return voucherId;
    }

    public void setVoucherId(Long voucherId) {
        this.voucherId = voucherId;
    }

    public Date getLeastDate() {
        return leastDate;
    }

    public void setLeastDate(Date leastDate) {
        this.leastDate = leastDate;
    }

    @Override
    public String toString() {
        return "VoucherModel{" + "leastMoney=" + leastMoney + ", discountMoney=" + discountMoney + ", voucherId=" +
                voucherId + ", leastDate=" + leastDate + '}';
    }
}
