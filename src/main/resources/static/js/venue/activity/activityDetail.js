$(function () {
    $.get("/api/activities/" + getUrlParam("activityId"))
        .done(function (activityModel) {
            initActivityDetail(activityModel);
        }).fail(function (e) {
        alertWindow(e.responseText);
    })
});

function initActivityDetail(activityModel) {
    let mapObj = activityModel.priceMap;
    let keys = Object.keys(mapObj);

    let priceMap =
        `<table class="layui-table">
            <colgroup>
                <col width="150">
                <col width="200">
                <col>
            </colgroup>
            <thead>
            <tr>
                <th>单价（元）</th>
                <th>剩余票数（张）</th>
            </tr> 
            </thead>
            <tbody>`;

    // 加上tbody
    for (let i = 0; i < keys.length; i++) {
        priceMap = priceMap + `<tr><td>${keys[i]}</td><td>${mapObj[keys[i]]}</td></tr>`;
    }

    priceMap = priceMap + `</tboy></table>`;

    let activityDetail =
        `<div class="upper">
        <img class="detail-photo" src=${activityModel.photo}/>
        <div class="detail-container">

            <h3 class="detail-title">${activityModel.name}</h3>

            <div class="detail-item">
                <p class="before-text">演出类型：${activityModel.activityType}</p>
            </div>

            <div class="detail-item">
                <p class="before-text">演出时间：${activityModel.dateString}</p>
            </div>

            <div class="detail-item">
                <p class="before-text">演出价格：</p>
                <div class="price-map">
                    ${priceMap}
                </div>
            </div>
        </div>
        </div>
        <div class="lower">
                <p class="lower-tip">演出介绍：</p>
                <p class="lower-detail">${activityModel.description}</p>
        </div>
        <div class="lower" style="margin: 1% auto">
            <button class="layui-btn layui-btn-normal layui-btn-fluid" onclick="buy()">现场购票</button>
        </div>`;

    $("#activity-detail").append(activityDetail);


    console.log(activityModel.priceMap);
    console.log(Object.keys(mapObj));
    console.log(activityModel.priceMap[0]);

}

function buy() {
    window.location.href = `/venue/activity/buy?activityId=${getUrlParam("activityId")}`;
}