let nowPage = 1;
let maxPage = 1;

$(function () {
    $.get("/api/venues/page-numbers", {
        "check-type": "MODIFY",
        "page-size": 5
    }).done(function (data) {
        maxPage = data - 0;
    }).done(function () {
        updateList();
        updatePageNum();
    });
});

function updateList() {
    $("#page").css("display", "");
    $.get("/api/venues/check-venues", {
        "check-type": "MODIFY",
        "page": nowPage,
        "page-size": 5
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

    console.log("data", data);

    for (let i = 0; i < data.length; i++) {
        content += `<div class="venue-item" id=${data[i].venueCode} onclick="{window.location.href='/manager/modifyVenue/detail?venueCode=${data[i].venueCode}'}">
                    <p class="venue-title able">${data[i].venueName}</p>
                    <p class="venue-info able">${data[i].checkTimeString}</p>
                    <p class="venue-href able">查看>></p>
                    </div>`;
    }
    for (let i = 5 - data.length; i > 0; i--) {
        content += `<div class="venue-disable"></div>`;
    }

    $("#venue-container").empty().append(content);
}

function searchVenue() {
    let input = $("#search-input").val();
    if (!input) {
        alertWindow("请输入关键词");
        return;
    }
    $("#page").css("display", "none");
    $.get(`/api/venues/check-venues/${input}`).done(function (data) {
        let content = `<div class="venue-item" id=${data.orderId} onclick="{window.location.href='/manager/modifyVenue/detail?venueCode=${data.venueCode}'}">
                    <p class="venue-title able">${data.venueName}</p>
                    <p class="venue-info able">${data.checkTimeString}</p>
                    <p class="venue-href able">查看>></p>
                    </div>`;
        content += `<div style="width: 80%; height: 50px; margin: 1% auto"><button id="return-btn" 
                    class="layui-btn layui-btn-normal layui-btn-fluid"
                        style="float: left; margin: 1% auto;" onclick="updateList()">返回
                </button></div>`;
        $("#venue-container").empty().append(content);
    }).fail(function (e) {
        alertWindow(e.responseText);
    })
}