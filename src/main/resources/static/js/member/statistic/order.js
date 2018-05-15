let nowPage = 1;
let maxPage = 1;

$(function () {
    layui.use('form', function () {
        layui.form.render('select');
        layui.form.on('select(test)', function (data) {
            initPage(data.value);
        });
    });
    initPage("PAYED_AND_UNCHECK");
});

function initPage(state) {
    $.get("/api/orders/page-numbers", {
        "user-type": "MEMBER",
        "id": sessionStorage.getItem("memberEmail"),
        "page-size": 5,
        "order-state": state
    }).done(function (data) {
        maxPage = data - 0;
    }).done(function () {
        updateList(state);
        updatePageNum();
    });
}

function updateList(state) {
    $("#page").css("display", "");
    $.get("/api/orders", {
        "user-type": "MEMBER",
        "id": sessionStorage.getItem("memberEmail"),
        "page": nowPage,
        "page-size": 5,
        "order-state": state
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

    for (let i = 0; i < data.length; i++) {
        content +=
            `<div class="order-item">
                <p class="order-title able">${data[i].activityName}</p>
                <p class="order-info able">${data[i].venueName}</p>
                <p class="order-info able">${data[i].placeDateString} 下单</p>
                <p class="order-info able">${data[i].orderState}</p>
                <a class="order-detail able" href="/member/order/detail?orderId=${data[i].orderId}">查看详情>></a>
            </div>`;
    }
    for (let i = 5 - data.length; i > 0; i--) {
        content += `<div class="order-disable"></div>`;
    }

    $("#o-container").empty().append(content);
}