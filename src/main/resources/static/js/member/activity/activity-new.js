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
    let high = document.body.clientWidth * 0.8 / 2.5;
    layui.use('carousel', function () {
        let carousel = layui.carousel;
        //建造实例
        let obj = carousel.render({
            elem: '#activity-gallery'
            , width: '80%' //设置容器宽度
            , arrow: 'always' //始终显示箭头
            , height: high
            //,anim: 'updown' //切换动画方式
        });

        window.onresize = function () {
            high = document.body.clientWidth * 0.8 / 2.5;
            let options = {
                elem: '#activity-gallery'
                , width: '80%'
                , arrow: 'always'
                , height: high
            };
            obj.reload(options);
        }
    });
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
                <div class="display-img-price heavy">100元</div>
                <div class="display-img-price">起</div>
            </div>`;
    }

    $(tabId).append(tab);
}

function updateType(type, isReverse, data) {

    let header = `<hr><div class="activity-floor">
    <div class="floor-header">${type}</div>
    <div class="floor-container">`;

    let main = `
        <div class="main-activity">
            <img class="main-img pointer" src="/showpic/${data[0].photo}" onclick="window.location.href='/member/activity/detail?activityId=${data[0].activityId}'"/>
            <div class="text" style="background-color: ${bgColor}">
                <p class="main-title">${data[0].name}</p>
                <p class="main-price main-heavy">100</p>
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
                    <p class="display-img-price heavy">100元</p>
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
                    <p class="display-img-price heavy">100元</p>
                    <p class="display-img-price">起</p>
                </div>`;
    }
    subOne += `</div></div>`;

    if (isReverse) {
        main = subOne + main;
    } else {
        main = main + subOne;
    }

    return header + main + `</div></div>`;

}


