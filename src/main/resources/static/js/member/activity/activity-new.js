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
   let typeOne = $.get("/api/activities/type", {
        type: "演唱会",
   })
});

$(function () {
    let high = document.body.clientWidth * 0.8 / 2.5;
    layui.use('carousel', function(){
        let carousel = layui.carousel;
        //建造实例
        carousel.render({
            elem: '#activity-gallery'
            ,width: '80%' //设置容器宽度
            ,arrow: 'always' //始终显示箭头
            ,height: high
            //,anim: 'updown' //切换动画方式
        });
    });
    layui.use('element', function(){
        // let element = layui.element;
    });
});

function updateTab(tabId, data) {

    let tab = ``;

    for (let i = 0; i < 5; i++) {
        tab += `<div class="display-img-container">
                <img class="display-img pointer" src="/showpic/${data[i].activityId}.jpg" onclick="window.location.href='/member/activity/detail?activityId=${data[i].activityId}'"/>
                <div class="display-img-description">${data[i].name}</div>
                <div class="display-img-price">票价：</div>
                <div class="display-img-price heavy">100元</div>
                <div class="display-img-price">起</div>
            </div>`;
    }

    $(tabId).append(tab);
}
