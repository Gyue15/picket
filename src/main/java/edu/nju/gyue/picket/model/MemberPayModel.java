package edu.nju.gyue.picket.model;

import java.util.List;

public class MemberPayModel {

    private List<VoucherModel> voucherModelList;

    private Double money;

    private Double memberDiscount;

    public Double getMemberDiscount() {
        return memberDiscount;
    }

    public void setMemberDiscount(Double memberDiscount) {
        this.memberDiscount = memberDiscount;
    }

    public List<VoucherModel> getVoucherModelList() {
        return voucherModelList;
    }

    public void setVoucherModelList(List<VoucherModel> voucherModelList) {
        this.voucherModelList = voucherModelList;
    }

    public Double getMoney() {
        return money;
    }

    public void setMoney(Double money) {
        this.money = money;
    }

    @Override
    public String toString() {
        return "MemberPayModel{" + "voucherModelList=" + voucherModelList + ", money=" + money + ", memberDiscount="
                + memberDiscount + '}';
    }
}
