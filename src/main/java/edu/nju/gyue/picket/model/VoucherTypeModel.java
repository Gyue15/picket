package edu.nju.gyue.picket.model;

public class VoucherTypeModel {

    private String description;

    private Long voucherTypeId;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getVoucherTypeId() {
        return voucherTypeId;
    }

    public void setVoucherTypeId(Long voucherTypeId) {
        this.voucherTypeId = voucherTypeId;
    }

    @Override
    public String toString() {
        return "VoucherTypeModel{" + "description='" + description + '\'' + ", voucherTypeId=" + voucherTypeId + '}';
    }
}
