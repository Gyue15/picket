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

<<<<<<< HEAD
<<<<<<< HEAD
    PAID_AND_UNMAIL("待发货"),

    /**
     * 已支付
     */
    PAID_AND_MAIL("已发货");
=======
=======
>>>>>>> 11a383bb01d3dbe5ce6769dcc64bd5dad7a16a51
    /**
     * 已支付
     */
    PAID("已支付");
<<<<<<< HEAD
>>>>>>> 11a383bb01d3dbe5ce6769dcc64bd5dad7a16a51
=======
>>>>>>> 11a383bb01d3dbe5ce6769dcc64bd5dad7a16a51

    private String s;

    OrderState(String s) {
        this.s = s;
    }

    public String getString() {
        return s;
    }
}
