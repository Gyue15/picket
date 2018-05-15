let nowPage = 1, maxPage = 1, pageSize = 5;
let venueCodeSet = new Set();

let inSearch = false;

$(function () {
    $.get("/api/venues/pay-page-numbers", {
        "page-size": pageSize
    }).done(function (data) {
        maxPage = data - 0;
        updateList();
        updatePageNum();
    });

});

function updateList() {
    inSearch = false;
    $("#page").css("display", "");
    $.get("/api/venues/pay-lists", {
        "page": nowPage,
        "page-size": pageSize
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
        let venueCode = data[i].venueCode;
        content += `<div class="pay-item">
                <div class="layui-form item-content" style="width: 95%">
                    <p class="before-text" style="width: 50px; float: left">
                        <input name=${venueCode} type="checkbox" class="before-text" lay-skin="primary" lay-filter="test"/>
                    </p>
                    <p class="before-text">${data[i].venueName}</p>
                    <p class="before-text">${data[i].unPayDateString} 起</p>
                    <p class="before-text">售票额：${data[i].tickSales}元</p>
                    <p class="after-text">需结算给场馆：${data[i].payMoney}元</p>
                    <button id=${venueCode} type="button" class="layui-btn layui-btn-primary layui-btn-sm pay-btn" onclick="pay(this)">结算</button>
                </div>
            </div>`;
    }
    for (let i = 5 - data.length; i > 0; i--) {
        content += `<div class="pay-item-disable"></div>`;
    }

    $("#pay-container").empty().append(content);
    layui.use('form', function () {
        let form = layui.form;
        form.render();
        form.on('checkbox(test)', function (data) {
            console.log(233);
            selectVenue(data);
        });
    });
}

function searchVenue() {
    inSearch = true;
    $("#page").css("display", "none");
    let input = $("#search-input").val();
    if (!input) {
        alertWindow("请输入关键词");
        return;
    }
    $.get(`/api/venues/pay-search`, {
        keyword: input
    }).done(function (data) {
        let content = `<div class="pay-item">
                <div class="layui-form item-content" style="width: 95%">
                    <p class="before-text able" style="width: 50px; float: left">
                        <input name=${data.venueCode} type="checkbox" class="before-text" lay-skin="primary" lay-filter="test"/>
                    </p>
                    <p class="before-text">${data.venueName}</p>
                    <p class="before-text">${data.unPayDateString} 起</p>
                    <p class="before-text">售票额：${data.tickSales}</p>
                    <p class="after-text">需结算给场馆：${data.payMoney}</p>
                    <button id=${data.venueCode} type="button" class="layui-btn layui-btn-primary layui-btn-sm pay-btn" onclick="pay(this)">结算</button>
                </div>
            </div>`;
        content += `<div style="width: 80%; height: 50px; margin: 1% auto"><button id="return-btn" 
                    class="layui-btn layui-btn-normal layui-btn-fluid"
                        style="float: left; margin: 1% auto;" onclick="updateList()">返回
                </button></div>`;
        $("#pay-container").empty().append(content);

    }).done(function () {
        layui.use('form', function () {
            let form = layui.form;
            form.render('checkbox');
            form.on('checkbox(test)', function (data) {
                selectVenue(data);
            });
        });
    }).fail(function (e) {
        alertWindow(e.responseText);
    })
}

function payAll() {

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/venues/pay",
        data: JSON.stringify(Array.from(venueCodeSet)),
        cache: false,
        timeout: 600000,
        success: function () {
            alertWindowCtrl("结算成功", "/manager/pay");
        },
        error: function (e) {
            alertWindow(e.responseText);
        }
    });
}

function selectAllVenue() {
    layui.use('form', function () {
        let form = layui.form;
        $("#pay-container").find('input').each(function (index, item) {
            item.checked = true;
            venueCodeSet.add(item.name);
            console.log(venueCodeSet);
        });
        form.render();
    });
    $("#all-select-btn").addClass("layui-btn-disabled");
    $("#all-pay-btn").removeClass("layui-btn-disabled");
}

function pay(btn) {
    let venueCode = btn.id;
    let venueList = [];
    venueList.push(venueCode);
    console.log(JSON.stringify(venueList));
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/venues/pay",
        data: JSON.stringify(venueList),
        cache: false,
        timeout: 600000,
        success: function () {
            alertWindowCtrl("结算成功", "/manager/pay");
        },
        error: function (e) {
            alertWindow(e.responseText);
        }
    });
}

function selectVenue(data) {
    if (data.elem.checked) {
        venueCodeSet.add(data.elem.name);
    } else {
        venueCodeSet.delete(data.elem.name);
    }
    if (venueCodeSet.size === 0) {
        $("#all-select-btn").removeClass("layui-btn-disabled");
        $("#all-pay-btn").addClass("layui-btn-disabled");
    } else if(venueCodeSet.size === pageSize || inSearch) {
        $("#all-select-btn").addClass("layui-btn-disabled");
        $("#all-pay-btn").removeClass("layui-btn-disabled");
    } else {
        $("#all-select-btn").removeClass("layui-btn-disabled");
        $("#all-pay-btn").removeClass("layui-btn-disabled");
    }

    console.log(venueCodeSet);

}



