package edu.nju.gyue.picket.entity;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long voucherId;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date leastDate;

    private Boolean isUsed;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}, fetch =
            FetchType.LAZY)
    @JoinColumn(name = "member_email")
    private Member member;

    private Double leastMoney;

    private Double discountMoney;

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

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
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

    public Boolean getUsed() {
        return isUsed;
    }

    public void setUsed(Boolean used) {
        isUsed = used;
    }
}
