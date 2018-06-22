let nowPage = 1;
let maxPage = 1;

let timeSelector = Number.MAX_VALUE;
let typeSelector = 'default';
let activityDate;

$(function () {
    // TODO 获得最大页码
    updateList();
    updatePageNum();
});

function displayList(data) {

    let activity = ``;

    let i;
    for (i = 0; i < data.length; i++) {
        activity += `${i % 2 === 0 ? '<div class="card-container">' : ''}`;
        activity += `<div class="card ${i % 2 === 0 ? 'left' : 'right'}">
        <div class="card-img-container">
            <img class="card-img" src="/showpic/${data[i].photo}" onclick="window.location.href='/member/activity/detail?activityId=${data[i].activityId}'"/>
        </div>
        <div class="card-text">
            <p class="card-text-title">${data[i].name}</p>
            <p class="card-text-description">
                简介：${data[i].description.substring(0, 30)}...</p>
            <div class="card-ticket-state-container">
                <p class="card-ticket-state">售票中</p>
                <p class="card-ticket-state">可选座</p>
            </div>
            <p class="card-text-date">${data[i].dateString}</p>
            <div style="width: 100%; height: 10%;">
                <p class="card-text-location">${data[i].venueName}</p>
                <p class="card-sub-price">元起</p>
                <p class="card-text-price">${data[i].minPrice}</p>
            </div>
        </div>
    </div>`;
        activity += `${i % 2 === 0 ? '' : '</div>'}`;
    }

    $("#photo-list").empty().append(activity);
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

function updateList() {
    $.get("/api/activities/type", {
        "type": getUrlParam("type"),
        "num": 10
    }).done(function (data) {
        activityDate = data;
        timeSelect(timeSelector);
        typeSelect(typeSelector);
        displayList(activityDate);
    }).fail(function (e) {
        alertWindow(e.responseText);
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

function timeSelect(type) {
    switch(type) {
        case Number.MAX_VALUE:
            $("#time-selector-0").addClass("selector-active");
            $("#time-selector-1").removeClass("selector-active");
            $("#time-selector-2").removeClass("selector-active");
            $("#time-selector-3").removeClass("selector-active");
            break;
        case 7:
            $("#time-selector-0").removeClass("selector-active");
            $("#time-selector-1").addClass("selector-active");
            $("#time-selector-2").removeClass("selector-active");
            $("#time-selector-3").removeClass("selector-active");
            break;
        case 30:
            $("#time-selector-0").removeClass("selector-active");
            $("#time-selector-1").removeClass("selector-active");
            $("#time-selector-2").addClass("selector-active");
            $("#time-selector-3").removeClass("selector-active");
            break;
        case 'weekend':
            $("#time-selector-0").removeClass("selector-active");
            $("#time-selector-1").removeClass("selector-active");
            $("#time-selector-2").removeClass("selector-active");
            $("#time-selector-3").addClass("selector-active");
            break;
    }
    timeSelector = type;
}

function typeSelect(type) {
    switch (type) {
        case 'default':
            $("#type-selector-0").addClass("selector-active");
            $("#type-selector-1").removeClass("selector-active");
            $("#type-selector-2").removeClass("selector-active");
            break;
        case 'date':
            $("#type-selector-0").removeClass("selector-active");
            $("#type-selector-1").addClass("selector-active");
            $("#type-selector-2").removeClass("selector-active");
            break;
        case 'discount':
            $("#type-selector-0").removeClass("selector-active");
            $("#type-selector-1").removeClass("selector-active");
            $("#type-selector-2").addClass("selector-active");
            break;

    }
    typeSelector = type;
}