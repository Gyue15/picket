let bgColor;

$(function () {
    let contentOne = $.get("/api/activities/homepage", {
        keyword: "猜你喜欢",
        num: 5
    });
    let contentTwo = $.get("/api/activities/homepage", {
        keyword: "最近热门",
        num: 5
    });
    let contentThree = $.get("/api/activities/homepage", {
        keyword: "最新演出",
        num: 5
    });


    $.when(contentOne, contentTwo, contentThree).done(function (data1, data2, data3) {
        updateTab("#content-one", data1[0]);
        updateTab("#content-two", data2[0]);
        updateTab("#content-three", data3[0]);
    })

});

$(function () {
    let type1 = $.get("/api/activities/type", {
        type: "演唱会",
        num: 7
    });
    let type2 = $.get("/api/activities/type", {
        type: "音乐会",
        num: 7
    });
    let type3 = $.get("/api/activities/type", {
        type: "话剧",
        num: 7
    });
    let type4 = $.get("/api/activities/type", {
        type: "海外",
        num: 7
    });

    $.when(type1, type2, type3, type4).done(function (data1, data2, data3, data4) {
        let type = '';
        bgColor = '#e85a4f';
        type += updateType("演唱会", false, data1[0]);
        bgColor = '#db7093';
        type += updateType("音乐会", true, data2[0]);
        bgColor = '#41b3a3';
        type += updateType("话剧", false, data3[0]);
        bgColor = 'rgb(44,62,80)';
        type += updateType("海外", true, data4[0]);

        $("#activity-floor").append(type);

    })


});

$(function () {
    layui.use('element', function () {
        // let element = layui.element;
    });

});

function updateTab(tabId, data) {

    let tab = ``;

    for (let i = 0; i < 5; i++) {
        tab += `<div class="display-img-container">
                <img class="display-img pointer" src="/showpic/${data[i].photo}" onclick="window.location.href='/member/activity/detail?activityId=${data[i].activityId}'"/>
                <div class="display-img-description">${data[i].name}</div>
                <div class="display-img-price">票价：</div>
                <div class="display-img-price heavy">${data[i].minPrice}元</div>
                <div class="display-img-price">起</div>
            </div>`;
    }

    $(tabId).append(tab);
}

function updateType(type, isReverse, data) {

    let header = `<hr><div class="activity-floor">
    <div class="floor-header">
    <div style="float: left; width: 30%;">${type}</div>
    <a class="pointer" style="float: right; font-size: 16px; width: 30%; text-align: right;" href='/member/activity?type=${type}'>更多>></a>
    </div>
    <div class="floor-container ${isReverse?'right':'left'}">`;

    let main = `
        <div class="main-activity">
            <img class="main-img pointer" src="/showpic/${data[0].photo}" onclick="window.location.href='/member/activity/detail?activityId=${data[0].activityId}'"/>
            <div class="text" style="background-color: ${bgColor}">
                <p class="main-title">${data[0].name}</p>
                <p class="main-price main-heavy">${data[0].minPrice}</p>
                <p class="main-price">元起</p>
            </div>
        </div>`;

    let subOne = `<div class="sub-activity">
            <div class="sub-row">`;
    for (let i = 1; i < Math.min(data.length, 4); i++) {
        subOne += `<img class="sub-img pointer" src="/showpic/${data[i].photo}" onclick="window.location.href='/member/activity/detail?activityId=${data[i].activityId}'"/>
                <div class="sub-img-description">
                    <p class="sub-img-title">${data[i].name}</p>
                    <p class="sub-img-date">${data[i].dateString}</p>
                    <p class="sub-img-venue">${data[i].venueName}</p>
                    <p class="display-img-price heavy">${data[i].minPrice}元</p>
                    <p class="display-img-price">起</p>
                </div>`;
    }
    subOne += `</div>`;

    subOne += `<div class="sub-row">`;
    for (let i = 4; i < Math.min(data.length, 7); i++) {
        subOne += `<img class="sub-img pointer" src="/showpic/${data[i].photo}" onclick="window.location.href='/member/activity/detail?activityId=${data[i].activityId}'"/>
                <div class="sub-img-description">
                    <p class="sub-img-title">${data[i].name}</p>
                    <p class="sub-img-date">${data[i].dateString}</p>
                    <p class="sub-img-venue">${data[i].venueName}</p>
                    <p class="display-img-price heavy">${data[i].minPrice}元</p>
                    <p class="display-img-price">起</p>
                </div>`;
    }
    subOne += `</div></div>`;

    main = main + subOne;

    return header + main + `</div></div>`;

}


