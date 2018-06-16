let orderId;
let lock;

$(function () {
    $("[data-toggle='tooltip']").tooltip();
});

$(function () {
    orderId = getUrlParam("orderId");
    $.get(`/api/orders/${orderId}`).done(function (data) {
        let seatString = `共${data.seats}座`;
        $("#activity-pic").attr("src", `/showpic/${data.activityId}.jpg`);
        $("#order-id").text(`订单号：${orderId}`);
        $("#activity-name").text(`相关演出：${data.activityName}`);
        $("#venue-name").text(`相关场馆：${data.venueName}`);
        $("#order-state").text(`订单状态：${data.orderState}`);
        $("#place-time").text(`下单时间：${data.placeDateString}`);
        $("#seat-list").text(`订购座位：${seatString}`);
        $("#begin-time").text(`演出开始时间：${data.beginDateString}`);
        $("#order-value").text(`订单金额：${data.orderValue} 元`);
        if (data.canCancel) {
            $("#cancel-btn").removeClass("layui-btn-disabled").css("display", "inline-block");
            $("#cancel-tip").css("display", "");
        }
        if (data.orderState === "UN_PAID") {
            $("#pay-btn").removeClass("layui-btn-disabled").css("display", "inline-block");
            lock = data.lock;
        }

    });
});

function cancelOrder() {
    $.post("/api/orders/cancel", {
        orderId: getUrlParam("orderId")
    }).done(function () {
        alertWindowCtrl("退订成功！", `/member/order/detail?orderId=${getUrlParam("orderId")}`);
    }).fail(function (e) {
        alertWindow(e.responseText);
    })
}

function payOrder() {
    window.location.href=`/member/activity/purchase/pay?/member/activity/purchase/pay?lock=${lock}&signature=${orderId}`;
}