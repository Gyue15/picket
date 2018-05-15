let venueData;

let venueDataCheck;

$(function () {
    $.post("/api/venues/messages", {
        venueCode: sessionStorage.getItem("venueCode")
    }).done(function (data) {
        if (data.needDisplay) {
            console.log(data);
            if (data.bodyString === null) {
                data.bodyString = "审核通过！";
            }
            alertWindow(data.bodyString, data.titleString);
        }
    });

    $.get("/api/venues/", {
        "venue-code": sessionStorage.getItem("venueCode")
    }).done(function (data) {
        venueData = data;
        changeData(data);
        $("#confirm-btn").addClass("layui-btn-disabled");
    }).fail(function (e) {
        console.log(e);
    })
});

function confirmEdit() {
    $.post("/api/venues/modify", venueData).done(function () {
        alertWindowCtrl("修改申请提交成功！", "/venue/info");
    }).fail(function (e) {
        alertWindow(e.responseText);
    })
}

function changeData(data) {
    $("#venue-name").text(data.venueName);
    $("#venue-code").text(data.venueCode);
    $("#venue-email").text(data.email);
    $("#venue-location").text(data.location);
    $("#venue-detail").text(data.detail);
    console.log(data);
    if (data.inCheck === true) {
        $(".edit-img-container").map(function (index, obj) {
            $(obj).css("display", "none");
            window.console.log(obj);
        });
        $("#confirm-btn").parent().css("display", "none");
        $("#tip").css("display", "");
        $.get("/api/venues/check", {
            "venue-code": sessionStorage.getItem("venueCode")
        }).done(function (data) {
            venueDataCheck = data;
            displayCheck();
        })
    }
}

function displayCheck() {
    if (venueDataCheck.venueName !== venueData.venueName) {
        $("#venue-name-check").text(`申请修改为：${venueDataCheck.venueName}`);
    }
    if (venueDataCheck.email !== venueData.email) {
        $("#venue-email-check").text(`申请修改为：${venueDataCheck.email}`);
    }
    if (venueDataCheck.location !== venueData.location) {
        $("#venue-location-check").text(`申请修改为：${venueDataCheck.location}`);
    }
    if (venueDataCheck.detail !== venueData.detail) {
        $("#venue-detail").text(`申请修改为：${venueDataCheck.detail}`).addClass("check");
    }
}

function editInfo(attr, inputId, obj, beforeId) {
    $(obj).css("display", "none");
    $(`#${beforeId}`).css("display", "none");
    $(`#${inputId}`).keypress(function () {
        onEnter(attr, inputId, obj, beforeId);
    }).parent().css("display", "");
    // venueData[attr] = $(`#${id}`).val();
}

function onEnter(attr, inputId, obj, beforeId) {
    console.log(venueData);
    let e = event || window.event;
    if (e.keyCode === 13 && $(`#${inputId}`).val()) {
        $(obj).css("display", "");
        $(`#${beforeId}`).css("display", "");
        $(`#${inputId}`).parent().css("display", "none");
        venueData[attr] = $(`#${inputId}`).val();
        $("#confirm-btn").removeClass("layui-btn-disabled");
        changeData(venueData);
    }
}