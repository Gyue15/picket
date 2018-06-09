let keyword;

$(function () {
    console.log(window.location.href);
    keyword = getUrlParam("keyword");
    console.log(keyword);
    $.get("/api/activities/search", {
        keyword: keyword
    }).done(function (data) {
        displayList(data);
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
});

function displayList(data) {
    console.log(data);
    $("#body ul").empty();
    for (let i = 0; i < data.length; i++) {
        let activity = `<li class=\"activity-item\">
                            <div class=\"info\">
                                <img class=\"photo\" src="/showpic/${data[i].photo}"/>
                                <h3 class=\"activity-title\">${data[i].name}</h3>
                                <p class=\"activity-info\">${data[i].activityType}</p></p>
                                <p class=\"activity-info\">${data[i].venueName}</p>
                                <p class=\"activity-info\">${data[i].dateString}</p>
                                <p class=\"introduction\">简介：<br>${data[i].description}</p>
                                <a id=\"${data[i].activityId}\" class=\"detail\" href=\"/member/activity/detail?activityId=${data[i].activityId}\">查看详情>></a>
                            </div>
                        </li>`;
        $("#body ul").append(activity);
    }
}