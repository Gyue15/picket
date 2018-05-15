let x = 50, y = 50;
let areaCode = 0;

function fill() {
    let activeObjects = canvas.getActiveObjects();
    for (let i in activeObjects) {
        activeObjects[i].set("fill", "white");
    }
    canvas.requestRenderAll();
}

function removeFill() {
    let activeObjects = canvas.getActiveObjects();
    for (let i in activeObjects) {
        activeObjects[i].set("fill", "transparent");
    }
    canvas.requestRenderAll();
}

function toTop() {
    let activeObject = canvas.getActiveObject();
    activeObject.moveTo(canvas.getObjects().length - 1);
    canvas.requestRenderAll();
}

$("#rect").click(function () {
    let rect = new fabric.AreaRect({
        venueName: venueData.venueName,
        top: parseInt(x),
        left: parseInt(y),
        width: 200,
        height: 200,
        fill: "transparent",
        stroke: "#8C8C8C",
        strokeWidth: 2,
        areaCode: parseInt(areaCode)
    });
    canvas.add(rect);
    x += 10;
    y += 10;
    areaCode++;
});

$("#oval").click(function () {
    let rect = new fabric.AreaCircle({
        venueName: venueData.venueName,
        top: parseInt(x),
        left: parseInt(y),
        radius: 100,
        fill: "transparent",
        stroke: "#8C8C8C",
        strokeWidth: 2,
        areaCode: parseInt(areaCode)
    });
    canvas.add(rect);
    x += 10;
    y += 10;
    areaCode++;
});

$("#triangle").click(function () {
    let rect = new fabric.AreaTriangle({
        venueName: venueData.venueName,
        top: parseInt(x),
        left: parseInt(y),
        width: 200,
        height: 200,
        fill: "transparent",
        stroke: "#8C8C8C",
        strokeWidth: 1,
        areaCode: parseInt(areaCode)
    });
    canvas.add(rect);
    x += 10;
    y += 10;
    areaCode++;
});

$("#polygon").click(function () {
    if (drawingObject.type == "roof") {
        drawingObject.type = "";
        lines.forEach(function (value, index, ar) {
            canvas.remove(value);
        });
        //canvas.remove(lines[lineCounter - 1]);
        roof = makeRoof(roofPoints);
        canvas.add(roof);
        canvas.renderAll();
    } else {
        drawingObject.type = "roof"; // roof type
        $("#tip").text("双击结束多边形的绘制");
    }
});

$("#name-area").click(function () {
    if (canvas.getActiveObjects().length === 0) {
        layer.open({
            type: 0,
            title: '提示信息',
            content: '请先选择一个区域'
        });
        return;
    }
    layer.open({
        type: 0,
        title: '填充信息',
        area: ['400px', '240px'],
        content:
            `<div class="layer-bar">
                <p class="layer-tip">填写区域名称</p>
                <input id="area-name" class="layer-input" type="text"/>
            </div>
            <div class="layer-bar">
                <p class="layer-tip">选择区域类型</p>
                <select id="area-type" name="area-type" class="layer-select">
                    <option value="0">可入座区域</option>
                    <option value="1">不可入座区域</option>
                </select>
            </div>`,
        btn: ['确认填充', '取消'],
        yes: function (index) {
            fillSeat();
            layer.close(index);
        },
        btn2: function (index) {
            layer.close(index);
        }
    });

});

function fillSeat() {
    let obj = canvas.getActiveObject();
    let areaName = $("#area-name").val();
    let areaType = $("#area-type").val();
    if (areaName === null || areaName === undefined || areaName === '') {
        return;
    }
    obj.set("areaName", areaName);
    obj.set("areaType", areaType);
    let color;
    if (areaType === '0') {
        color = "#52c41a";
        obj.set({
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            hasControls: false,
            stroke: color
        });
        let code = obj.areaCode;
        // 先删除重复的
        for (let i = 0; i < venueData.areaList.length; i++) {
            if (code === venueData.areaList[i]["areaCode"]) {
                venueData.areaList.splice(i, 1);
            }
        }

        venueData.areaList.push({"areaName": areaName, "areaCode": code});
    } else {
        color = "#f5222d";
        obj.set({
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            hasControls: false,
            stroke: color
        });
    }

    // 文字
    let offset = 18;
    let textbox = new fabric.Textbox(areaName, {
        left: obj.left + obj.width * obj.scaleX / 2 - offset,
        top: obj.top + obj.height * obj.scaleY / 2 - offset,
        width: obj.width * obj.scaleX / 2,
        fontSize: 20,
        fill: color,
    });
    canvas.add(textbox);
    canvas.renderAll();

}

let roof = null;
let roofPoints = [];
let lines = [];
let lineCounter = 0;
let drawingObject = {};
drawingObject.type = "";
drawingObject.background = "";
drawingObject.border = "";

function Point(x, y) {
    this.x = x;
    this.y = y;
}

// canvas Drawing
let xx = 0;
let yy = 0;

fabric.util.addListener(window, 'dblclick', function () {
    drawingObject.type = "";
    lines.forEach(function (value, index, ar) {
        canvas.remove(value);
    });
    //canvas.remove(lines[lineCounter - 1]);
    roof = makeRoof(roofPoints);
    canvas.add(roof);
    canvas.renderAll();
    areaCode++;

    roofPoints = [];
    lines = [];
    lineCounter = 0;
    $("#tip").text("请先绘制区域形状，然后给区域命名。命名前请先选择区域。");
});

canvas.on('mouse:down', function (options) {
    if (drawingObject.type === "roof") {
        canvas.selection = false;
        setStartingPoint(options); // set x,y
        roofPoints.push(new Point(xx, yy));
        let points = [xx, yy, xx, yy];
        lines.push(new fabric.Line(points, {
            strokeWidth: 2,
            selectable: false,
            stroke: "#f5222d",
            // originX: xx,
            // originY: yy
        }).set("x1", xx).set("y1", yy));
        canvas.add(lines[lineCounter]);
        lineCounter++;
        canvas.on('mouse:up', function (options) {
            canvas.selection = true;
        });
    }
});

canvas.on('mouse:move', function (options) {
    if (lines[0] !== null && lines[0] !== undefined && drawingObject.type === "roof") {
        setStartingPoint(options);
        lines[lineCounter - 1].set({
            x2: xx,
            y2: yy
        });
        canvas.renderAll();
    }
});

function setStartingPoint(options) {
    let offset = $('#c').offset();
    xx = options.e.pageX - offset.left;
    yy = options.e.pageY - offset.top;
}

function makeRoof(roofPoints) {

    let left = findLeftPaddingForRoof(roofPoints);
    let top = findTopPaddingForRoof(roofPoints);
    roofPoints.push(new Point(roofPoints[0].x, roofPoints[0].y));
    let roof = new fabric.AreaPolyline(roofPoints, {
        venueName: venueData.venueName,
        fill: 'transparent',
        stroke: "#8C8C8C",
        strokeWidth: 2,
        areaCode: parseInt(areaCode)
    });
    roof.set({
        left: left,
        top: top,
    });
    return roof;
}

function findTopPaddingForRoof(roofPoints) {
    let result = 999999;
    for (let f = 0; f < lineCounter; f++) {
        if (roofPoints[f].y < result) {
            result = roofPoints[f].y;
        }
    }
    return Math.abs(result);
}

function findLeftPaddingForRoof(roofPoints) {
    let result = 999999;
    for (let i = 0; i < lineCounter; i++) {
        if (roofPoints[i].x < result) {
            result = roofPoints[i].x;
        }
    }
    return Math.abs(result);
}
