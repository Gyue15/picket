let nowPage = 1;
let maxPage = 1;

let activityType;

$(function () {

    if (this.location.href === "http://localhost:8080/venue/activity") {
        activityType = "VENUE_NEW_ACTIVITY";
    } else {
        activityType = "VENUE_OLD_ACTIVITY";
    }

    $.get("/api/activities/page-numbers", {
        "activity": activityType,
        "id": sessionStorage.getItem("venueCode"),
        "page-size": 3
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
        $("#body ul").append(activityList(data[i]));
    }
    for (let i = 0; i < 3 - data.length; i++) {
        let block =
            `<li>
                <div class="block"></div>
            </li>`;
        $("#body ul").append(block);
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
        "activity": activityType,
        "id": sessionStorage.getItem("venueCode"),
        "page": nowPage,
        "page-size": 3
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

function activityList(data) {
    let description = data.description;
    if (description.length >= 100 ) {
        description = description.slice(0, 100);
        description += "..."
    }
    console.log(description);
    if (this.location.href === "http://localhost:8080/venue/activity") {
        return `<li class="activity-item">
                    <div class="info">
                        <img class="photo" src="${data.photo}"/>
                        <h3 class="activity-title">${data.name}</h3>
                        <p class="activity-info">${data.activityType}</p></p>
                        <p class="activity-info">${data.dateString}</p>
                        <p class="introduction">简介：<br>${description}</p>
                        <a id="${data.activityId}" class="detail" href="/venue/activity/detail?activityId=${data.activityId}">查看活动>></a>
                    </div>
                </li>`;
    } else {
        return `<li class=\"activity-item\">
                    <div class=\"info\">
                         <img class=\"photo\" src=\"${data.photo}\"/>
                         <h3 class=\"activity-title\">${data.name}</h3>
                         <p class=\"activity-info\">${data.activityType}</p></p>
                         <p class=\"activity-info\">${data.dateString}</p>
                         <p class=\"introduction\">简介：<br>${description}</p>
                    </div>
                </li>`;
    }

}