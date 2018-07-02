let unpayData;

$(function () {
    updateList($("#paid"), "PAID_AND_UNMAIL");
    updateList($("#unpaid"), "UN_PAID");
    updateList($("#cancelled"), "CANCELLED");
});

function updateList(domElement, state) {
    $("#page").css("display", "");
    $.get("/api/orders", {
        "user-type": "MEMBER",
        "id": localStorage.getItem("memberEmail"),
        "order-state": state,
        "page": 0,
        "page-size": 0
    }).done(function (data) {
        displayList(domElement, data, state);
    }).fail(function (xhr) {
        console.log(xhr.responseText);
    });
}

function displayList(domElement, data, state) {
    if (data.length === 0) {
        domElement.append(`<div class="no-order">暂时没有订单哦～</div>`);
        return;
    }
    let order = ``;
    let temp = [];
    for (let i in data) {
        let obj = data[i];
        let unitPrice = ``;
        for (let j in obj.seatPriceList) {
            if (temp.indexOf(obj.seatPriceList[j]) !== -1) {
                continue;
            }
            temp.push(obj.seatPriceList[j]);
            if (j > 0) {
                unitPrice += ', ';
            }
            unitPrice += `${obj.seatPriceList[j]}元`;

        }
        let button = `
                <button class="order-detail-pointer" onclick="window.location.href='/member/order/detail?orderId=${obj.orderId}'">
                    查看详情
                </button>`;
        if (state === "PAID_AND_UNMAIL" && obj.canCancel) {
            button += `<button class="order-another-pointer" onclick="cancelOrder('${obj.orderId}')">
                    退订订单
                </button>`;
        } else if (state === 'UN_PAID') {
            button += `<button class="order-another-pointer" onclick="window.location.href='/member/activity/purchase/pay?signature=${obj.orderId}'">
                    现在支付
                </button>`;
        }
        order += `<div class="order-item">
                <div class="order-img-container">
                    <img class="order-img" src="/showpic/${obj.activityId}.jpg"/>
                </div>
                <div class="order-left-container">
                    <div class="order-title">
                        ${obj.activityName}
                    </div>
                    <div class="order-info-item">
                        <div class="order-info-tip">订单号：</div>
                        <div class="order-info"> ${obj.orderId}</div>
                    </div>
                    <div class="order-info-item">
                        <div class="order-info-tip">下单时间：</div>
                        <div class="order-info"> ${obj.placeDateString}</div>
                    </div>
                    <div class="order-info-item">
                        <div class="order-info-tip">门票数量：</div>
                        <div class="order-info"> ${obj.seats}张</div>
                    </div>
                    <div class="order-info-item">
                        <div class="order-info-tip">门票单价：</div>
                        <div class="order-info">${unitPrice}</div>
                    </div>
                    <div class="order-info-item">
                        <div class="order-info-tip">演出场馆：</div>
                        <div class="order-info">${obj.venueName}</div>
                    </div>
                    <div class="order-info-item">
                        <div class="order-info-tip">订单总额：</div>
                        <div class="order-info">${obj.orderValue}元</div>
                    </div>
                </div>
                ${button}
            </div>
            <hr style="width: 100%">`;
    }

    // let page = `<div id="${state}-page"><div id="${state}-before" class="page-item" onclick="turnPage(-1)">上一页</div>
    //         <div id="${state}-pageNum" class="page-item page-num">1/10</div>
    //         <div id="${state}-after" class="page-item" onclick="turnPage(1)">下一页</div></div>`;

    domElement.empty().append(order);
}

function cancelOrder(orderId) {
    alertWindowCtrl("你确定要退订订单吗？", `javascript: cancelOrderClick(${orderId})`);
    console.log(orderId);

}

function cancelOrderClick(orderId) {
    $.post("/api/orders/cancel", {
        orderId: orderId,
    }).done(function () {
        $.get("/api/orders", {
            "user-type": "MEMBER",
            "id": localStorage.getItem("memberEmail"),
            "order-state": "PAID_AND_UNMAIL",
            "page": 0,
            "page-size": 0
        }).done(function (data) {
            displayList($("#paid"), data, "PAID_AND_UNMAIL");
            alertWindow("成功退订");
        }).fail(function (e) {
            alertWindow(e.responseText);
        });

    }).fail(function (e) {
        alertWindow(e.responseText);
    })
}