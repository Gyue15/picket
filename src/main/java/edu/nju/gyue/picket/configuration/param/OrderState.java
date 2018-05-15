package edu.nju.gyue.picket.configuration.param;

public enum OrderState {

    /**
     * 未支付
     */
    UN_PAYED("未支付"),
    /**
     * 取消支付
     */
    CANCLED("已取消"),

    /**
     * 已支付，未检票（已完成）
     */
    PAYED_AND_UNCHECK("已完成"),

    /**
     * 已支付，已检票（已完成）
     */
    PAYED_AND_CHECKED("已完成"),

    /**
     * 已退订
     */
    UNSUBSCRIBE("已退订"),

    /**
     * 线下购票
     */
    OFF_LINE("线下购票");

    private String s;

    OrderState(String s) {
        this.s = s;
    }

    public String getString() {
        return s;
    }
}
