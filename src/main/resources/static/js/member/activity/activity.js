let nowPage = 1;
let maxPage = 1;

$(function () {
    $.get("/api/activities/type", {
        "type": getUrlParam("type"),
        "num": 10
    }).done(function (data) {
        maxPage = data - 0;
    }).done(function () {
        updateList();
        updatePageNum();
    });
});

function displayList(data) {
    let activity = ``;

    let i;
    for (i = 0; i < data.length; i++) {
        activity += `${i % 2 === 0 ? '<div class="card-container">' : ''}`;
        activity += `<div class="card ${i % 2 === 0 ? 'left' : 'right'}" onclick="window.location.href='/member/activity/detail?activityId=${data[i].activityId}'">
        <div class="card-img-container">
            <img class="card-img" src="/showpic/${data[i].photo}"/>
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

    $("#photo-list").append(activity);
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
    $.get("/api/activities", {
        "activity": "MEMBER_ACTIVITY",
        "id": sessionStorage.getItem("memberEmail"),
        "page": nowPage,
        "page-size": 5
    }).done(function (data) {
        console.log(data);
        displayList(data);
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