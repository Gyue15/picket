let nowPage = 1;
let maxPage = 1;

$(function () {
    $.get("/api/activities/page-numbers", {
        "activity": "MEMBER_ACTIVITY",
        "id": sessionStorage.getItem("memberEmail"),
        "page-size": 5
    }).done(function (data) {
        maxPage = data - 0;
    }).done(function () {
        updateList();
        updatePageNum();
    });
});

function displayList(data) {
    $("#body ul").empty();
    for (let i = 0; i < data.length; i++) {
        let activity = `<li class="activity-item">
                            <div class="info">
                                <img class="photo" src="/showpic/${data[i].photo}"/>
                                <h3 class="activity-title"><a href="/member/activity/detail?activityId=${data[i].activityId}">${data[i].name}</a></h3>
                                <p class="activity-info">${data[i].activityType}</p></p>
                                <p class="activity-info">${data[i].venueName}</p>
                                <p class="activity-info">${data[i].dateString}</p>
                                <p class="introduction">简介：<br>${data[i].description}</p>
                                <a id="${data[i].activityId}" class="detail" href="/member/activity/detail?activityId=${data[i].activityId}">查看详情>></a>
                            </div>
                        </li>`;
        $("#body ul").append(activity);
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