let areaList = [];
let seatGraphList = [];
let priceList = [];
let seatPrice;

let totalPrice = 0.0;

let colors = ["#FFB800", "#009688", "#2F4056", "#1E9FFF", "#FF5722"];

let colorMap = new Map();

$(function () {
    let loadSeatGraph = $.get("/api/venues/seats", {
        "venue-code": localStorage.getItem("venueCode")
    });

    let loadSeatPrice = $.get("/api/activities/seat-prices", {
        "venue-code": localStorage.getItem("venueCode"),
        "activity-id": getUrlParam("activityId")
    });

    $.when(loadSeatGraph, loadSeatPrice).done(function (data1, data2) {
        initGraph(data1, data2);
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
});

function initGraph(data1, data2) {

    // 载入图形
    let seatGraph = data1[0];
    let selector = `<select name="type" lay-verify="required" lay-filter="test">`;
    for (let i = 0; i < seatGraph.length; i++) {
        areaList.push({"areaCode": seatGraph[i].areaCode, "areaName": seatGraph[i].areaName});
        seatGraphList.push(seatGraph[i].seatGraph);
        selector += `<option value=${seatGraph[i].areaCode}>${seatGraph[i].areaName}</option>`;
    }
    selector += `</select>`;
    $("#area-type").empty().append(selector);
    layui.use('form', function () {
        layui.form.render('select');
        layui.form.on('select(test)', function (data) {
            saveAndChange(data);
        });
    });

    seatPrice = data2[0];

    // 遍历价格，建立价格和颜色的映射
    let index = 0;
    for (let i = 0; i < data2[0].length; i++) {
        if (!inPrice(data2[0][i].price)) {
            colorMap.set(data2[0][i].price, index);
            index++;
            // console.log(colorMap)
        }
    }
    // console.log(colorMap);
    canvas.loadFromJSON(seatGraphList[0], canvas.renderAll.bind(canvas), function (o, object) {
        if (object.type === "image") {
            object.set({selectable: false, hoverCursor: 'default'});
        } else {
            setColor(data2[0], object)
        }
    });

}

function setColor(data, object) {
    // console.log("setColor: " + data);
    let seatId = `${localStorage.getItem("venueCode")}|${object.areaCode}|${object.row}|${object.column}`;
    let seatInfo = judge(seatId, data);
    if (seatInfo) {
        // object.set({stroke: colors[colorMap.get(seatInfo.price)], price: seatInfo.price});
        if (seatInfo.sold) {
            object.set({
                hasControls: false,
                fill: colors[colorMap.get(seatInfo.price)],
                selectable: false,
                hoverCursor: 'default',
                stroke: colors[colorMap.get(seatInfo.price)],
                price: seatInfo.price,
                strokeWidth: 2,
            });
        } else {
            object.set({
                hasControls: false,
                fill: "#ffffff",
                hoverCursor: 'default',
                stroke: colors[colorMap.get(seatInfo.price)],
                price: seatInfo.price,
                strokeWidth: 2,
            });
        }
    } else {
        object.set({
            hasControls: false,
            fill: object.stroke,
            hoverCursor: 'default',
            stroke: colors[colorMap.get(seatInfo.price)],
            price: seatInfo.price,
            strokeWidth: 2,
            selectable: false,
        });
    }

}

function judge(seatId, seatList) {
    for (let i = 0; i < seatList.length; i++) {
        if (seatList[i].seatId === seatId) {
            return seatList[i];
        }
    }
    return false;
}

function saveAndChange(data) {
    // console.log(data);
    let nextAreaCode = data.value;
    let nextIndex;

    // 找到坐标
    for (let i = 0; i < areaList.length; i++) {
        if (areaList[i]["areaCode"] === nextAreaCode - 0) {
            nextIndex = i;
            break;
        }
    }

    // 清空画布
    canvas.clear();

    // 载入以前的数据
    canvas.loadFromJSON(seatGraphList[nextIndex], canvas.renderAll.bind(canvas), function (o, object) {
        if (object.type === "image") {
            object.set({selectable: false, hoverCursor: 'default'});
        } else {
            setColor(seatPrice, object)
        }
    });

}

function inPrice(price) {
    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i] === price) {
            return true;
        }
    }
    priceList.push(price);
    return false;
}

function checkMember() {
    let email = $("#email-input").val();
    if (!email) {
        alertWindow("请输入会员邮箱");
        return;
    }
    if (totalPrice === 0.0) {
        alertWindow("请输先选择座位");
        return;
    }
    console.log(email);
    $.get("/api/members/discounts", {
        email: email,
    }).done(function (data) {
        let num = totalPrice * data;
        $("#total-price").text(`优惠价：${num.toFixed(2)}元`).css("display", "");
    }).fail(function (e) {
        console.log(e.responseText);
    });
}

function confirmBuy() {
    let objects = canvas.getActiveObjects();
    let seatIdList = [];
    objects.map(function (object) {
        seatIdList.push({seatId: `${localStorage.getItem("venueCode")}|${object.areaCode}|${object.row}|${object.column}|${getUrlParam("activityId")}`});
    });

    $.post("/api/activities/place-order/off-line", {
        activityId: getUrlParam("activityId"),
        seatIdListString: JSON.stringify(seatIdList),
        email: $("#email-input").val(),
        venueCode: localStorage.getItem("venueCode")
    }).done(function (data) {

        console.log("success", data.orderId);
        alertWindowCtrl("购买成功！", `/venue/activity/buy?activityId=${getUrlParam("activityId")}`)

    }).fail(function (e) {
        alertWindow(e.responseText);
    })
}

canvas.on('selection:created', function (ev) {
    ev.target.set({
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        hoverCursor: 'default',

    });
    if (ev.target.type === "seat") {
        totalPrice = ev.target.price;
        $("#total-price").text(`总价：${totalPrice}元`).css("display", "");
    } else {
        totalPrice = 0.0;
        ev.target._objects.map(function (object) {
            totalPrice += object.price;
        });
        $("#total-price").text(`总价：${totalPrice}元`).css("display", "");
    }
    console.log(ev.target)
});

canvas.on('selection:cleared', function () {
    totalPrice = 0.0;
    $("#total-price").css("display", "none");
    console.log(233)
});
