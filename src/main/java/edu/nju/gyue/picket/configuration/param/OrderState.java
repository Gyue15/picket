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

    /**
     * 已支付
     */
    PAID("已支付");

    private String s;

    OrderState(String s) {
        this.s = s;
    }

    public String getString() {
        return s;
    }
}
