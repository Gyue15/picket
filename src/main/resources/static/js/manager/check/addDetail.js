let zoom = 0.92;

let areaData, seatData, venueData;


$(function () {
    canvas.setWidth(canvas.getWidth() * zoom);
    canvas.setHeight(canvas.getHeight() * zoom);
    let getArea = $.get("/api/venues/area-graphs", {
        "venue-code": getUrlParam("venueCode")
    });

    let getSeat = $.get("/api/venues/seats", {
        "venue-code": getUrlParam("venueCode")
    });

    let venueData = $.get("/api/venues/check", {
        "venue-code": getUrlParam("venueCode")
    });

    $.when(getArea, getSeat, venueData).done(function (data1, data2, data3) {
        areaData = data1[0].data;
        seatData = data2[0];
        venueData = data3[0];
        console.log(venueData);
        $("#venue-name").text(`${venueData.venueName}`);
        $("#venue-code").text(`${venueData.venueCode}`);
        $("#venue-email").text(`${venueData.email}`);
        $("#venue-location").text(`${venueData.location}`);
        $("#venue-detail").text(`${venueData.detail}`);
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
            if (id === "basic-info") {
                console.log(id);
                loadVenueInfo();
            } else {
                loadCanvas(id);
            }
        };
    });
    $("#basic-info").trigger("click");
}

function loadVenueInfo() {
    $("#graph").css("display", "none");
    $("#step-bar").css("display", "none");
    $("#content").css("display", "");

}

function loadCanvas(id) {
    $("#graph").css("display", "");
    $("#content").css("display", "none");
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

function checkResult(checkType) {
    let reason = '';
    if (checkType === "NOT_ALLOW") {
        layer.open({
            type: 0,
            title: '审核信息',
            area: ['400px', '240px'],
            content:
                `<div class="layer-bar">
                <p style="font-size: 16px; float: left">填写理由：</p>
                <textarea id="reason" type="text" style="height: 80px;width:100%; margin: 1% auto"/>
            </div>`,
            btn: ['确认', '取消'],
            yes: function (index) {
                reason = $("#reason").val();
                uploadCheck(checkType, reason);
                layer.close(index);
            },
            btn2: function (index) {
                layer.close(index);
            }
        });
    } else {
        uploadCheck(checkType, reason);
    }
}

function uploadCheck(checkType, reason) {
    $.post("/api/venues/check-result", {
        venueCode: getUrlParam("venueCode"),
        checkResult: checkType,
        reason: reason
    }).done(function () {

        window.location.href = "/manager/addVenue";
    }).fail(function (e) {
        console.log(e.responseText)
    })
}