let activityId = getUrlParam("activityId");
let email = localStorage.getItem("memberEmail");
let venueCode;
let isSubscribed = false;

$(function () {
    $.post("/api/activities/is-subscribe", { activityId, email }).done (function(data) {
        isSubscribed = data;
        $.get("/api/activities/" + getUrlParam("activityId"))
            .done(function (activityModel) {
                venueCode = activityModel.venueCode;
                initActivityDetail(activityModel);
            }).fail(function (e) {
            alertWindow(e.responseText);
        });
    }
    )
    let hotActivityList = $.get("/api/activities/homepage", {
        keyword: "最近热门",
        num: 5
    });
    $.when(hotActivityList).done(function (data) {
        updateHotActivity(data);
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
    let hasTicket = false;
    for (let i = 0; i < keys.length; i++) {
        priceMap = priceMap + `<tr><td>${keys[i]}</td><td>${mapObj[keys[i]]}</td></tr>`;
        if (mapObj[keys[i]] > 0) {
            hasTicket = true;
        }
    }

    priceMap = priceMap + `</tbody></table>`;

    // 加上票务订阅

    if (!hasTicket && !isSubscribed) {
        priceMap = priceMap + `<div id="subscribe-container"><button class="layui-btn" id="subscribe" onclick="subscribe()" style="float:right;">在有票的时候通知我</button></div>`;
    }
    else if(isSubscribed) {
        priceMap = priceMap + `<div id="subscribe-container"><button class="layui-btn" id="subscribe" onclick="subscribe()" style="float:right;">已关注</button></div>`;
    }
    let newActivityDetail = `
                        <div class ="row"><div class="col-sm-4">
                            <div style="">
                                <img src="/showpic/${activityModel.photo}" style="width:  100%;">
                            </div>
                        </div>

                        <div class="col-sm-8">
                            <h2 class="order-id">${activityModel.name}</h2>
                            <div style="font-size: 20px;margin-top: 2%;">
                                <ins>¥ 200.0 起</ins>
                            </div>
                            <div style="background: 0 0 #e6e6e6;font-size: 18px;margin-top: 5%;padding: 15px;">
                                本演出支持在线选座，不如试试？
                                <a class="showlogin" onclick="{location.href='/member/activity/purchase?activityId=${activityId}&amp;venueCode=${activityModel.venueCode}'}">选座下单</a>
                            </div>
                            <div class="detail-item">
                                <p class="before-text">演出场馆：${activityModel.venueName}  <a href="javascript:void(0)" onclick="openMap('${activityModel.venueName}')"><i class="fas fa-map-marker-alt"></i> 查看位置 </a></p>
                            </div>
                            <div class="detail-item">
                                <p class="before-text">演出时间：${activityModel.dateString}</p>
                            </div>
                                     
                            <div class="detail-item">
                                <p class="before-text">演出介绍：</p>
                                <p class="lower-detail">${activityModel.description}</p>
                            </div>
                            
                            <div class="detail-item">
                                <p class="before-text">演出价格：</p>
                                <div class="price-map">${priceMap}</div>
                            </div>
                            <div style="margin-top: 10%;">
                                <button class="layui-btn layui-btn-normal" onclick="purchaseNow()" style="float: right">立即购买</button>
                                <button class="layui-btn layui-btn-normal" onclick="{location.href='/member/activity/purchase?activityId=${activityId}&amp;venueCode=${activityModel.venueCode}'}" style="float: right; margin-right: 20px">选座购买</button>
                            </div>

                        </div>
                </div>`;

    $("#activity-detail").append(newActivityDetail);


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

function openMap(venueName) {
    layer.open({
        title: '场馆位置',
        type: 0, 
        area: ['540px'],
        content: '<div id="map-container" style="width:500px;height:356px;"></div>',
        btn: []
    }); 
    var map = new BMap.Map("map-container");    
    // 创建地址解析器实例     
    var myGeo = new BMap.Geocoder();      
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(venueName, function(point){      
        if (point) {      
            map.centerAndZoom(point, 16);      
            map.addOverlay(new BMap.Marker(point));      
        }      
    }, 
    "全国");
    map.enableScrollWheelZoom();
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
        email: localStorage.getItem("memberEmail"),
        venueCode: venueCode
    }).done(function (data) {
        if (data.orderId !== "wrong") {
            window.location.href = `/member/activity/purchase/pay?lock=false&signature=${data.orderId}`;
        } else {
            alertWindow("余座不足");
        }
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
}

function updateHotActivity(data) {

    let tab = ``;

    for (let i = 0; i < data.length; i++) {
        tab += `<li class="single-sidebar" style="margin-top: 15px">
                        <img class="sub-img pointer" onclick="window.location.href='/member/activity/detail?activityId=${data[i].activityId}'" src="/showpic/${data[i].photo}" style="width: 50%;float: left;border-radius: 10px;">
                        <div class="sub-img-description" style="float: left;width: 45%;">
                            <p class="sub-img-title" style="width: 100%;height: 0;padding-bottom: 30%;">${data[i].name}</p>
                            <p class="sub-img-date" style="width: 100%;height: 0;padding-bottom: 30%;color: #8e8d8a;">${data[i].dateString}</p>
                            <p class="sub-img-venue" style="width: 100%;height: 0;padding-bottom: 30%;">${data[i].venueName}</p>
                            <p class="display-img-price heavy" style="font-weight: 900;margin-top: 40%;color: #e85a4f;">100元</p>
                            <p class="display-img-price" style="float: left;margin-right: 5px;margin-top: 40%;color: #8e8d8a;">起</p>
                        </div>
                    </li>`;
    }

    $("#hot-activity").append(tab);
}

function subscribe() {
    // 订阅并修改订阅按钮状态
    if (!isSubscribed) {
        $.post("/api/activities/subscribe", { activityId, email }).done(function(){
            $("#subscribe").text("已关注");
        })
    } else {
        $.post("/api/activities/cancel-subscribe", { activityId, email }).done(function(){
            $("#subscribe").text("已取消关注");
        })
    }   
}