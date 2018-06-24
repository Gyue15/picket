let nowPage = 1;
let maxPage = 1;
let pageSize = 10;

let activityDate;

let keyword, type, sort, sorttype, filter;


$(function () {
    keyword = getUrlParam("keyword") || "";
    type = getUrlParam("type") || "";
    sort = getUrlParam("sort") || "hot";
    filter = getUrlParam("filter") || "all";
    nowPage = getUrlParam("page") || 1;
    sorttype = getUrlParam("sorttype") || "desc";

    $.get("/api/activities/list-numbers", {
        keyword: keyword,
        type: type,
        filter: filter,
        sorttype: sorttype,
        sort: sort
    }).done(function (data) {
        maxPage = data;
        updateList();
        updatePageNum();
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
});

function updatePage() {
    nowPage = 1;
    $.get("/api/activities/list-numbers", {
        keyword: keyword,
        type: type,
        filter: filter,
        sorttype: sorttype,
        sort: sort
    }).done(function (data) {
        maxPage = data;
        updateList();
        updatePageNum();
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
}

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
    $.get("/api/activities/list", {
        keyword: keyword,
        type: type,
        filter: filter,
        sorttype: sorttype,
        sort: sort,
        pagesize: pageSize,
        pagenum: Math.min(nowPage, maxPage)
    }).done(function (data) {
        activityDate = data;
        changeFilter(filter);
        changeSort(sort);
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

function updateFilter(type) {
    changeFilter(type);
    updatePage();
}

function changeFilter(type) {
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
    filter = type;
}

function updateSort(type) {
    changeSort(type);
    updatePage();
}

function changeSort(type) {
    switch (type) {
        case 'hot':
            $("#type-selector-0").addClass("selector-active");
            $("#type-selector-1").removeClass("selector-active");
            $("#type-selector-2").removeClass("selector-active");
            break;
        case 'time':
            $("#type-selector-0").removeClass("selector-active");
            $("#type-selector-1").addClass("selector-active");
            $("#type-selector-2").removeClass("selector-active");
            break;
        case 'price':
            $("#type-selector-0").removeClass("selector-active");
            $("#type-selector-1").removeClass("selector-active");
            $("#type-selector-2").addClass("selector-active");
            break;

    }
    sort = type;
}