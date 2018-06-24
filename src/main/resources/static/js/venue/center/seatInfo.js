let zoom = 0.92;

let areaData, seatData;


$(function () {
    canvas.setWidth(canvas.getWidth() * zoom);
    canvas.setHeight(canvas.getHeight() * zoom);
    let getArea = $.get("/api/venues/area-graphs", {
        "venue-code": localStorage.getItem("venueCode")
    });

    let getSeat = $.get("/api/venues/seats", {
        "venue-code": localStorage.getItem("venueCode")
    });

    $.when(getArea, getSeat).done(function (data1, data2) {
        areaData = data1[0].data;
        seatData = data2[0];
        console.log(areaData);
        console.log(seatData);
        initPage();
    })
});

function initPage() {
    $("#chart-nav p").each(function () {
        let id = this.id;
        this.onclick = function () {
            $("#chart-nav p").each(function () {
                if (this.id === id) {
                    $(this).addClass("chart-active");
                } else {
                    $(this).removeClass("chart-active");
                }
            });
            loadCanvas(id);
        };
    });
    $("#area-graph").trigger("click");
}

function loadCanvas(id) {
    switch (id) {
        case "area-graph" :
            loadArea();
            break;
        case "seat-graph":
            loadSeat();
    }
}

function loadArea() {
    $("#step-bar").css("display", "none");
    canvas.loadFromJSON(areaData, canvas.renderAll.bind(canvas), function (o, object) {
        object.set({hasControls: false, selectable: false, hoverCursor: 'default'});
        object.scaleX = object.scaleX * zoom;
        object.scaleY = object.scaleY * zoom;
        object.left = object.left * zoom;
        object.top = object.top * zoom;
        object.setCoords();
    });
    // resizeCanvas(zoom);
}

let areaList = [];
let seatGraphList = [];

function loadSeat() {
    $("#step-bar").css("display", "");
    // 载入图形
    let selector = `<select name="type" lay-verify="required" lay-filter="test">`;
    for (let i = 0; i < seatData.length; i++) {
        areaList.push({"areaCode": seatData[i].areaCode, "areaName": seatData[i].areaName});
        seatGraphList.push(seatData[i].seatGraph);
        selector += `<option value=${seatData[i].areaCode}>${seatData[i].areaName}</option>`;
    }
    selector += `</select>`;
    $("#area-type").empty().append(selector);
    layui.use('form', function () {
        layui.form.render('select');
        layui.form.on('select(test)', function (data) {
            saveAndChange(data);
        });
    });

    canvas.clear();
    canvas.loadFromJSON(seatGraphList[0], canvas.renderAll.bind(canvas), function (o, object) {
        object.set({hasControls: false, selectable: false, hoverCursor: 'default'});
        object.scaleX = object.scaleX * zoom;
        object.scaleY = object.scaleY * zoom;
        object.left = object.left * zoom;
        object.top = object.top * zoom;
        object.setCoords();
    });
}

function saveAndChange(data) {
    let nextAreaCode = data.value;
    let nextIndex;

    // / 找到坐标
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
        object.set({hasControls: false, selectable: false, hoverCursor: 'default'});
        object.scaleX = object.scaleX * zoom;
        object.scaleY = object.scaleY * zoom;
        object.left = object.left * zoom;
        object.top = object.top * zoom;
        object.setCoords();
    });

}
