let areaList = [];
let seatGraphList = [];
let priceList = [];
let seatPrice;

let areaMap = new Map();

let colors = ["#FFB800", "#009688", "#2F4056", "#1E9FFF", "#FF5722"];
let colorNames = ["orange", "green", "cyan", "blue", "red"];

let colorMap = new Map();

$(function () {
    let loadSeatGraph = $.get("/api/venues/seats", {
        "venue-code": getUrlParam("venueCode")
    });

    let loadSeatPrice = $.get("/api/activities/seat-prices", {
        "venue-code": getUrlParam("venueCode"),
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
        areaMap.set(seatGraph[i].areaCode, seatGraph[i].areaName);
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
    console.log("color", colorMap);
    let colorTips = "价格区间：";
    for (let [key, value] of colorMap) {
        colorTips += `<span class="layui-badge layui-bg-${colorNames[value]}" 
                        style="height: 30px; padding-top: 7px; margin: 2px">${key}元</span>`;
    }
    $("#price-bar").append(colorTips);

    canvas.loadFromJSON(seatGraphList[0], canvas.renderAll.bind(canvas), function (o, object) {
        if (object.type === "image") {
            object.set({selectable: false, hoverCursor: 'default'});
        } else {
            setColor(data2[0], object)
        }
    });
    canvas.selection = false;

    $("#select-tip").text("你已选择：" + areaMap.get(seatGraph[0].areaCode));
    $("#seats").text("");
    $("#total-price").text(`总价：0元`);

}

function setColor(data, object) {
    // console.log("setColor: " + data);
    let seatId = `${getUrlParam("venueCode")}|${object.areaCode}|${object.row}|${object.column}`;
    let seatInfo = judge(seatId, data);
    // console.log(seatId);
    if (seatInfo) {
        // object.set({stroke: colors[colorMap.get(seatInfo.price)], price: seatInfo.price});
        if (seatInfo.sold) {
            object.set({
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
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
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                hasControls: false,
                fill: "#ffffff",
                hoverCursor: 'default',
                stroke: colors[colorMap.get(seatInfo.price)],
                price: seatInfo.price,
                strokeWidth: 2,
            });
            // console.log(233);
        }
    } else {
        object.set({
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            hasControls: false,
            fill: object.stroke,
            hoverCursor: 'default',
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
    counter = 0;
    totalPrice = 0.0;

    // 载入以前的数据
    canvas.loadFromJSON(seatGraphList[nextIndex], canvas.renderAll.bind(canvas), function (o, object) {
        if (object.type === "image") {
            object.set({selectable: false, hoverCursor: 'default'});
        } else {
            setColor(seatPrice, object)
        }
    });

    $("#select-tip").text("你已选择：" + areaMap.get(nextAreaCode - 0));
    $("#seats").text("");
    $("#total-price").text(`总价：0元`);

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

let counter = 0;
let totalPrice = 0.0;

canvas.on('mouse:down', function (e) {
    if (e.target === null) {
        return;
    }
    // 点上
    if (e.target.fill === "#ffffff") {
        if (counter >= 6) {
            return;
        }
        e.target.set({fill: "#52c41a"});
        // e.target.fill = "#52c41a";
        counter++;
        totalPrice += e.target.price - 0;
        canvas.renderAll();
        console.log(counter, totalPrice);
        updatePrice();
        return;

    }
    // 点掉
    if (e.target.fill === "#52c41a") {
        e.target.set({fill: "#ffffff"});
        // e.target.fill = "#ffffff";
        counter--;
        totalPrice -= e.target.price - 0;
        canvas.renderAll();
        console.log(counter, totalPrice);
        updatePrice()
    }
});

function updatePrice() {
    let seats = '|';
    let buy = false;
    canvas.getObjects().map(function (item) {
        if (item.fill === "#52c41a") {
            seats += `${item.row}排${item.column}座|`;
            buy = true;
        }
    });
    if (buy) {
        $("#seats").text(seats);
        $("#total-price").text(`总价：${totalPrice}元`);
    } else {
        $("#seats").text("");
        $("#total-price").text(`总价：0元`);
    }

}


function confirmBuy() {
    if (totalPrice === 0.0) {
        alertWindow("请至少选择一个座位");
        return;
    }
    let seatIdList = [];
    canvas.getObjects().map(function (item) {
        if (item.fill === "#52c41a") {
            seatIdList.push({"seatId": `${getUrlParam("venueCode")}|${item.areaCode}|${item.row}|${item.column}|${item.areaName}`});
        }
    });
    $.post("/api/activities/place-order/select", {
        activityId: getUrlParam("activityId"),
        seatIdListString: JSON.stringify(seatIdList),
        email: sessionStorage.getItem("memberEmail"),
        venueCode: getUrlParam("venueCode")
    }).done(function (data) {
        window.location.href = `/member/activity/purchase/pay?/member/activity/purchase/pay?lock=true&signature=${data.orderId}`;
    }).fail(function (e) {
        alertWindowCtrl(e.responseText, `/member/activity/purchase?activityId=${getUrlParam("activityId")}&venueCode=${getUrlParam("venueCode")}`);
    })
}

