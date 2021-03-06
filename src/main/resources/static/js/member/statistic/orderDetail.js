let orderId;
let lock;

$(function () {
    $("[data-toggle='tooltip']").tooltip();
});

$(function () {
    orderId = getUrlParam("orderId");
    $.get(`/api/orders/${orderId}`).done(function (data) {
        console.log(data);
        let seatString = `共${data.seats}座`;
        $("#activity-pic").attr("src", `/showpic/${data.activityId}.jpg`);
        $("#order-id").text(`订单号：${orderId}`);
        $("#activity-name").html(`相关演出：<a href=/member/activity/detail?activityId=${data.activityId}>${data.activityName}</a>`);
        $("#venue-name").text(`相关场馆：${data.venueName}`);
        $("#order-state").text(`订单状态：${data.orderState}`);
        $("#place-time").text(`下单时间：${data.placeDateString}`);         
        $("#seat-num").html(`订购座位：${seatString} ${data.orderState === '已取消'?'':'<a id="seat-more" href="#seat" onclick="displaySeats()">查看详情</a>'}`);
        for (let i = 0; i < data.seatNameList.length; i = i + 1) {
            $("#seat-list").append(`<p class="seat-info"><span class="seat-name">${data.seatNameList[i]} </span><span class="seat-price">${data.seatPriceList[i]}元</span></p>`)
        }
        $("#begin-time").text(`演出开始时间：${data.beginDateString}`);
        $("#order-value").text(`订单金额：${data.orderValue} 元`);
        if (data.canCancel) {
            $("#cancel-btn").removeClass("layui-btn-disabled").css("display", "inline-block");
            $("#cancel-tip").css("display", "");
        }
        if (data.orderState === "未支付") {
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

function displaySeats() {
    $("#seat-list").css("display", "");
    $("#seat-more").css("display", "none");
}