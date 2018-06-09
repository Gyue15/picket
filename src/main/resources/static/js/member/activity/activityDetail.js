let activityId = getUrlParam("activityId");
let venueCode;

$(function () {
    $.get("/api/activities/" + getUrlParam("activityId"))
        .done(function (activityModel) {
            venueCode = activityModel.venueCode;
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
        <img class="detail-photo" src=\"/showpic/${activityModel.photo}\"/>
        <div class="detail-container">

            <h3 class="detail-title">${activityModel.name}</h3>

            <div class="detail-item">
                <p class="before-text">演出类型：${activityModel.activityType}</p>
            </div>

            <div class="detail-item">
                <p class="before-text">演出时间：${activityModel.dateString}</p>
            </div>
            
            <div class="detail-item">
                <p class="before-text">演出地点：${activityModel.location} ${activityModel.venueName}</p>
            </div>
            
            <div class="detail-item">
                <p class="before-text">联系方式：${activityModel.email}</p>
            </div>

            <div class="detail-item">
                <p class="before-text">演出价格：</p>
                <div class="price-map">
                    ${priceMap}
                </div>
            </div>
            <div class="detail-item">
                <p class="lower-tip">演出介绍：</p>
                <p class="lower-detail">${activityModel.description}</p>
            </div>
        </div>
        </div>
        <div class="lower" style="margin: 1% auto">
            <button class="layui-btn layui-btn-normal" 
            onclick="purchaseNow()" 
            style="float: right">立即购买</button>
            <button class="layui-btn layui-btn-normal" 
            onclick="{location.href='/member/activity/purchase?activityId=${activityId}&venueCode=${activityModel.venueCode}'}" 
            style="float: right; margin-right: 20px">选座购买</button>
        </div>`;

    $("#activity-detail").append(activityDetail);


    console.log(activityModel);
    console.log(Object.keys(mapObj));
    console.log(activityModel.priceMap[0]);

}

function purchaseNow() {
    $.get("/api/activities/prices", {
        activityId: getUrlParam("activityId")
    }).done(function (data) {
        let layerTip = "";
        data.map(function (item) {
            layerTip += `<option value=${item}>${item}元</option>`;
        });
        layer.open({
            type: 0,
            title: '填充信息',
            area: ['400px', '240px'],
            content:
                `<div class="layer-bar">
                <p class="layer-tip">填写购买张数</p>
                <input id="num" class="layer-input" type="number"  min="1" max="20"/>
            </div>
            <div class="layer-bar">
                <p class="layer-tip">选择价格区间</p>
                <select id="price-type" name="price-type" class="layer-select">
                    ${layerTip}
                </select>
            </div>`,
            btn: ['确认购买', '取消'],
            yes: function (index) {
                buyNow();
                layer.close(index);
            },
            btn2: function (index) {
                layer.close(index);
            }
        });
    }).fail(function (e) {
        alertWindow(e.responseText)
    });
}

function buyNow() {
    let num = $("#num").val();
    let price = $("#price-type").val();
    if (num > 20) {
        alertWindow("不能购买超过20张！");
        return;
    }
    if (num <= 0) {
        alertWindow("请至少购买1张！");
    }
    $.post("/api/activities/place-order/un-select", {
        activityId: activityId,
        unitPrice: price,
        num: num,
        email: sessionStorage.getItem("memberEmail"),
        venueCode: venueCode
    }).done(function (data) {
        window.location.href = `/member/activity/purchase/pay?lock=false&signature=${data.orderId}`;
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
}
