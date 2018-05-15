let orderId;
$(function () {
    orderId = getUrlParam("orderId");
    $.get(`/api/orders/${orderId}`).done(function (data) {
        $("#order-id").text(`订单号：${orderId}`);
        $("#activity-name").text(`相关演出：${data.activityName}`);
        $("#venue-name").text(`相关场馆：${data.venueName}`);
        $("#order-state").text(`订单状态：${data.orderState}`);
        $("#place-time").text(`下单时间：${data.placeDateString}`);
        $("#seat-list").text(`订购座位：${data.seats}`);
        $("#begin-time").text(`演出开始时间：${data.beginDateString}`);
        $("#order-value").text(`订单金额：${data.orderValue}`);

    });
});