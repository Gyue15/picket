package edu.nju.gyue.picket.entity;

import javax.persistence.*;
import java.util.List;

@Entity
public class VoucherType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long voucherTypeId;

    private String description;

    private Double leastMoney;

    private Double discountMoney;

    private Integer needPoint;

    public Long getVoucherTypeId() {
        return voucherTypeId;
    }

    public void setVoucherTypeId(Long voucherTypeId) {
        this.voucherTypeId = voucherTypeId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

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

    public Integer getNeedPoint() {
        return needPoint;
    }

    public void setNeedPoint(Integer needPoint) {
        this.needPoint = needPoint;
    }
}
