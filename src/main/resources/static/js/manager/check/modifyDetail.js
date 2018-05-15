let areaData, seatData, venueData;


$(function () {
    $.get("/api/venues/check", {
        "venue-code": getUrlParam("venueCode")
    }).done(function (data) {
        venueData = data;
        console.log(venueData);
        $("#venue-name").text(`${venueData.venueName}`);
        $("#venue-code").text(`${venueData.venueCode}`);
        $("#venue-email").text(`${venueData.email}`);
        $("#venue-location").text(`${venueData.location}`);
        $("#venue-detail").text(`${venueData.detail}`);
    });

});


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

        window.location.href = "/manager/modifyVenue";
    }).fail(function (e) {
        console.log(e.responseText)
    })
}
