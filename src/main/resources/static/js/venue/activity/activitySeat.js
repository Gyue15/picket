let areaList = [];
let seatGraphList = [];

let nowAreaCode;
let nowIndex;

let colorNames = ["orange", "green", "cyan", "blue", "red"];
let colors = ["#FFB800", "#009688", "#2F4056", "#1E9FFF", "#FF5722"];
let colorPointer = 0;
let colorMap = [];

function initSeat() {
    $.get("/api/venues/seats", {
        "venue-code": sessionStorage.getItem("venueCode")
    }).done(function (data) {
        console.log(data);
        let selector = `<select name="type" lay-verify="required" lay-filter="test">`;
        for (let i = 0; i < data.length; i++) {
            areaList.push({"areaCode": data[i].areaCode, "areaName": data[i].areaName});
            seatGraphList.push(data[i].seatGraph);
            selector += `<option value=${data[i].areaCode}>${data[i].areaName}</option>`;
        }
        selector += `</select>`;
        $("#area-type").empty().append(selector);
        layui.use('form', function () {
            layui.form.render('select');
            layui.form.on('select(test)', function (data) {
                saveAndChange(data);
            });
        });
        nowAreaCode = areaList[0].areaCode;
        nowIndex = 0;
        canvas.loadFromJSON(seatGraphList[0], canvas.renderAll.bind(canvas), function (o, object) {
            if (object.type === "image") {
                object.set({selectable: false, hoverCursor: 'default'});
            } else {
                object.set({hasControls: false, hoverCursor: 'default'});
            }
        });

    });
}

function saveAndChange(data) {
    console.log(data.value);
    let nextAreaCode = data.value;
    let nextIndex;

    // / 找到坐标
    for (let i = 0; i < areaList.length; i++) {
        if (areaList[i]["areaCode"] === nextAreaCode - 0) {
            nextIndex = i;
            break;
        }
    }

    // 保存现在的数据
    saveData();
    seatGraphList[nowIndex] = JSON.stringify(canvas);
    console.log(seatMap);

    // 清空画布
    canvas.clear();

    // 载入以前的数据
    canvas.loadFromJSON(seatGraphList[nextIndex], canvas.renderAll.bind(canvas), function (o, object) {
        if (object.type === "image") {
            object.set({selectable: false, hoverCursor: 'default'});
        } else if (object.fill !== "transparent") {
            object.set({selectable: false, hasControls: false, hoverCursor: 'default'});
        } else {
            object.set({hasControls: false, hoverCursor: 'default'});
        }
    });

    nowIndex = nextIndex;
}

function saveData() {
    let objects = canvas.getObjects();
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].price) {
            seatMap.set(`${sessionStorage.getItem("venueCode")}|${objects[i].areaCode}|${objects[i].row}|${objects[i].column}|${objects[i].areaName}`,
                objects[i].price);
        }
    }
    if (seatMap.size === 0) {
        alertWindow("请至少设置一个可出售座位");
    }
}

function setPrice() {
    let activeObjects = canvas.getActiveObjects();
    for (let i = 0; i < activeObjects.length; i++) {
        if (activeObjects[i].type !== "seat") {
            activeObjects.splice(i, 1);
        }
    }
    if (activeObjects.length < 1) {
        alertWindow("请至少选择一个座位！");
        return;
    }
    let price = $("#price-input").val();
    price = parseFloat(price);
    if (price !== price || price === 0) {
        alertWindow("请输入有效数字");
        return;
    }

    let nowPointer;
    let find = false;
    for (let i = 0; i < colorMap.length; i++) {
        if (colorMap[i].price === price) {
            nowPointer = colorMap[i].color;
            find = true;
            break;
        }
    }
    if (!find) {
        nowPointer = colorPointer;
        colorPointer++;
        colorMap.push({price: price, color: nowPointer});
        if (nowPointer > 4) {
            alertWindow("价格区间过多！");
            return;
        }
    }

    for (let i = 0; i < activeObjects.length; i++) {
        let object = activeObjects[i];
        object.set({fill: colors[nowPointer], selectable: false, stroke: colors[nowPointer], price: price});
    }
    canvas.renderAll();
    if (!find) {
        addTips(colorNames[nowPointer], `${price}元`);
    }

}

canvas.on('selection:created', function (ev) {
    ev.target.set({
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        hoverCursor: 'default'
    });
});

function addTips(color, str) {
    let colorTips = `<span class="layui-badge layui-bg-${color}" 
                        style="height: 30px; padding-top: 7px; margin: 2px">${str}</span>`;
    $("#step-bar").append(colorTips);
}
