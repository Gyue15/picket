let nowPage = 1;
let maxPage = 1;

$(function () {
    $.get("/api/orders/page-numbers", {
        "user-type": "VENUE",
        "id": localStorage.getItem("venueCode"),
        "page-size": 5,
        "order-state": null
    }).done(function (data) {
        maxPage = data - 0;
    }).done(function () {
        updateList();
        updatePageNum();
    });
});

function updateList() {
    $("#page").css("display", "");
    $.get("/api/orders", {
        "user-type": "VENUE",
        "id": localStorage.getItem("venueCode"),
        "page": nowPage,
        "page-size": 5,
        "order-state": null
    }).done(function (data) {
        console.log(data);
        displayList(data);
    }).fail(function (xhr) {
        console.log(xhr.responseText);
    });
}

function updatePageNum() {
    $("#pageNum").text(`${nowPage}/${maxPage}`);

    if (nowPage > 1) {
        $("#before").addClass("page-active");
        $("#before").removeClass("page-disactive");
    } else {
        $("#before").addClass("page-disactive");
        $("#before").removeClass("page-active");
    }

    if (nowPage < maxPage) {
        $("#after").addClass("page-active");
        $("#after").removeClass("page-disactive");
    } else {
        $("#after").addClass("page-disactive");
        $("#after").removeClass("page-active");
    }

}

function turnPage(turnNum) {
    turnNum = turnNum - 0;
    if (nowPage + turnNum <= 0 || nowPage + turnNum > maxPage) {
        return;
    }
    nowPage = nowPage + turnNum;
    updateList();
    updatePageNum();
}

function displayList(data) {
    let content = "";

    console.log(data);
    console.log(data.length);

    for (let i = 0; i < data.length; i++) {
        content += `<div class="order-item" id=${data[i].orderId}">
                    <p class="order-title able">${data[i].activityName}</p>
                    <p class="order-info able">单号：${data[i].orderId}</p>
                    <p class="order-info able">${data[i].placeDateString}</p>
                    <p class="order-info able">${data[i].orderValue}元</p>
                    <p class="order-info able">${data[i].orderState}</p>
                    <a class="order-detail able" href='/venue/orderDetail?orderId=${data[i].orderId}'>查看详情>></a>
                    </div>`;
    }
    for (let i = 5 - data.length; i > 0; i--) {
        content += `<div class="order-disable"></div>`;
    }

    $("#order-container").empty().append(content);
}

function searchOrder() {
    $("#page").css("display", "none");
    let input = $("#search-input").val();
    if (!input) {
        alertWindow("请输入订单号");
        return;
    }
    $.get(`/api/orders/${input}`).done(function (data) {
        let content = `<div class="order-item" id=${data.orderId}">
                    <p class="order-title able">${data.activityName}</p>
                    <p class="order-info able">单号：${data.orderId}</p>
                    <p class="order-info able">${data.placeDateString}</p>
                    <p class="order-info able">${data.orderValue}元</p>
                    <p class="order-info able">${data.orderState}</p>
                     <a class="order-detail able" href='/venue/order/orderDetail?orderId=${data.orderId}'>查看详情>></a>
                    </div>`;
        content += `<div style="width: 80%; height: 50px; margin: 1% auto"><button id="return-btn" 
                    class="layui-btn layui-btn-normal layui-btn-fluid"
                        style="float: left; margin: 1% auto;" onclick="updateList()">返回
                </button></div>`;
        $("#order-container").empty().append(content);
    }).fail(function (e) {
        alertWindow(e.responseText);
    })
}