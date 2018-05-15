package edu.nju.gyue.picket.entity;

import edu.nju.gyue.picket.configuration.param.PayMethod;
import edu.nju.gyue.picket.entity.Member;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "payment_account")
public class PayAccount {

    @Id
    private String accountId;

    @Enumerated(EnumType.STRING)
    private PayMethod payMethod;

    private String password;

    private Double money;

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public PayMethod getPayMethod() {
        return payMethod;
    }

    public void setPayMethod(PayMethod payMethod) {
        this.payMethod = payMethod;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Double getMoney() {
        return money;
    }

    public void setMoney(Double money) {
        this.money = money;
    }
}
