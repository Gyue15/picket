package edu.nju.gyue.picket.configuration.param;

public enum OrderState {

    /**
     * 未支付
     */
    UN_PAID("未支付"),
    /**
     * 取消支付或退订
     */
    CANCELLED("已取消"),

    PAID_AND_UNMAIL("待发货"),

    /**
     * 已支付
     */
    PAID_AND_MAIL("已发货");

    private String s;

    OrderState(String s) {
        this.s = s;
    }

    public String getString() {
        return s;
    }
}
