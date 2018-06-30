let activityId = getUrlParam("activityId");
let email = localStorage.getItem("memberEmail");
let venueCode;
let isSubscribed = false;
let priceMap;
let nowPrice = 0;
let priceNum = 1;

$(function () {
    $.post("/api/activities/is-subscribe", {activityId, email}).done(function (data) {
            isSubscribed = data;
            $.get("/api/activities/" + getUrlParam("activityId"))
                .done(function (activityModel) {
                    venueCode = activityModel.venueCode;
                    initActivityDetail(activityModel);
                    initActivityHeader(activityModel);
                }).fail(function (e) {
                alertWindow(e.responseText);
            });
        }
    );

    let hotActivityList = $.get("/api/activities/homepage", {
        keyword: "最近热门",
        num: 5
    });
    $.when(hotActivityList).done(function (data) {
        updateHotActivity(data);
    })
});

function initActivityHeader(activityModel) {
    let activityType = activityModel.activityType.split(",")[0];
    let crumb = `
<div id="crumb">
  <a href="/">首页</a>
  >
  <a href="/member/activity?type=${activityType}">${activityType}</a>
  >
  <a id="cite">${activityModel.name}</a>
</div>`;
    $("#header-menu").append(crumb);
}

function updateHotActivity(data) {
    let hot = `<div class="sub-title">
            热门演出
        </div>
        <div class="hot-show">
            <img class="hot-img" onclick="window.location.href='/member/activity/detail?activityId=${data[0].activityId}'" src="/showpic/${data[0].photo}" />
            <div class="hot-show-title" onclick="window.location.href='/member/activity/detail?activityId=${data[0].activityId}'">${data[0].name}</div>
            <div class="hot-sub-bar">${data[0].dateString}</div>
            <div class="hot-sub-bar"><i class="icon-map small" onclick="openMap('${data[0].venueName}')">&#xe6bb;</i>${data[0].venueName}</div>
        </div>
        <hr style="width: 100%; margin-bottom: 20px">`;
    for (let i = 1; i < data.length; i++) {
        hot += `<div class="hot-show">
            <div class="hot-show-title" onclick="window.location.href='/member/activity/detail?activityId=${data[i].activityId}'">${data[i].name}</div>
            <div class="hot-sub-bar">${data[i].dateString}</div>
            <div class="hot-sub-bar"><i class="icon-map small" onclick="openMap('${data[i].venueName}')">&#xe6bb;</i>${data[i].venueName}</div>
        </div>
        <hr style="width: 100%; margin-bottom: 20px">`;
    }
    $("#hot-container").append(hot);
}

function initActivityDetail(activityModel) {
    priceMap = activityModel.priceMap;
    let keys = Object.keys(priceMap);

    let hasTicket = keys.length !== 0;

    let price = ``;
    if (!isSubscribed && !hasTicket) {
        price += `<ul id="detail-price-ul">
                    <li class="detail-price-li">
                        暂无余票
                    </li>
                    <li id="subscribe" class="detail-price-li active" onclick="subscribe()">
                        在有票时通知我
                    </li>
                </ul>`;
    } else if (!hasTicket) {
        price += `<ul id="detail-price-ul">
                    <li class="detail-price-li">
                        暂无余票
                    </li>
                </ul>`;
    } else {
        keys.sort();
        nowPrice = keys[0];
        price += `<ul id="detail-price-ul">`;
        for (let i in keys) {
            price += `<li id="li-${i}" class="detail-price-li ${i === '0' ? 'active' : ''}" onclick="changeNowPrice('li-${i}', ${keys.length}, ${keys[i]})">${keys[i]}元</li>`;
        }
        price += '</ul>';
    }


    let activityDetail = `
    <div id="detail-img-container">
        <img id="detail-img" src="/showpic/${activityModel.photo}"/>
    </div>
    <div id="detail-text">
        <div id="detail-title">
            ${activityModel.name}
            <button id="un-subscribe" onclick="subscribe()" style="display: ${isSubscribed ? 'block' : 'none'}">取消关注</button>
        </div>
        <div id="detail-info">
            <div class="detail-info-row">
                <div class="detail-tip">时间：</div>
                <div class="detail-item">${activityModel.dateString}</div>
            </div>
            <div class="detail-info-row">
                <div class="detail-tip">场馆：</div>
                <div class="detail-item">
                    <div class="map-tip">${activityModel.venueName}</div>
                    <i class="icon-map" onclick="openMap('${activityModel.venueName}')">&#xe6bb;</i>
                    <div class="map-tip back" onclick="openMap('${activityModel.venueName}')">查看地图</div>
                </div>
            </div>
            <div class="detail-info-row">
                <div class="detail-tip">地址：</div>
                <div class="detail-item">${activityModel.location}</div>

            </div>
            <div class="detail-info-row lower">
                <div class="detail-tip lower">价格：</div>
                ${price}
            </div>
            <div class="detail-info-row lower">
                <div class="detail-tip lower">数量：</div>
                <div id="detail-num">
                    <i class="icon-num" style="float: left" onclick="changePriceNum(-1)">&#xe679;</i>
                    <div id="num">1</div>
                    <i class="icon-num" style="float: right" onclick="changePriceNum(1)">&#xe601;</i>
                </div>
            </div>
            <div class="detail-info-row lower">
                <div class="detail-tip lower">合计：</div>
                <div id="detail-sum">
                    ${nowPrice}元
                </div>
            </div>
        </div>

        <div id="button-bar">
            <button id="btn-buy-now" onclick="buyNow()">立即购买</button>
            <button id="btn-buy-select" onclick="purchaseSelection()">选座购买</button>
        </div>
    </div>`;

    $("#activity-container").append(activityDetail);
    $("#description-detail").html(activityModel.html);

    for (let i in keys) {
        let priceBlock = $(`#li-${i}`);
        priceBlock.attr("title", `剩余${priceMap[keys[i]]}张`);
        priceBlock.attr("data-toggle", "tooltip");
        priceBlock.attr("data-placement", "top");
        priceBlock.tooltip();
    }
}

function openMap(venueName) {
    layer.open({
        title: '场馆位置',
        type: 0,
        area: ['540px'],
        content: '<div id="map-container" style="width:500px;height:356px;"></div>',
        btn: []
    });
    let map = new BMap.Map("map-container");
    // 创建地址解析器实例
    let myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(venueName, function (point) {
            if (point) {
                map.centerAndZoom(point, 16);
                map.addOverlay(new BMap.Marker(point));
            }
        },
        "全国");
    map.enableScrollWheelZoom();
}

function purchaseSelection() {
    if (localStorage.getItem("username")) {
        location.href = "/member/activity/purchase?activityId=" + activityId + "&venueCode=" + venueCode;
    } else {
        alertWindow("请先登录");
    }
}

function buyNow() {
    let num = priceNum;
    let price = nowPrice;
    if (num <= 0 || !num) {
        alertWindow("请至少购买1张！");
        return;
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

function subscribe() {
    // 订阅并修改订阅按钮状态
    if (!isSubscribed) {
        if (Notification.permission === "default") {
            Notification.requestPermission().then(function (result) {
                console.log(result);
            });
        }
        $.post("/api/activities/subscribe", {activityId, email}).done(function () {
            $("#subscribe").css("display", "none");
            $("#un-subscribe").css("display", "");
        })
    } else {
        $.post("/api/activities/cancel-subscribe", {activityId, email}).done(function () {
            $("#subscribe").css("display", "");
            $("#un-subscribe").css("display", "none");
            alertWindow("已取消关注");
        })
    }
}

function changePriceNum(changeNum) {
    if (priceNum + changeNum <= 0) {
        alertWindow("请至少购买一张");
        return;
    }
    if (priceNum + changeNum > priceMap[nowPrice]) {
        alertWindow("没有更多的票了");
        return;
    }
    priceNum += changeNum;
    $("#num").text(priceNum);
    $("#detail-sum").text(`${nowPrice * priceNum}元`);
}

function changeNowPrice(liId, liNum, price) {
    for (let i = 0; i < liNum; i++) {
        if (liId === `li-${i}`) {
            $(`#li-${i}`).addClass("active");
            nowPrice = price;
        } else {
            $(`#li-${i}`).removeClass("active");
        }
    }
    $("#detail-sum").text(`${nowPrice * priceNum}元`);
}