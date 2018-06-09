let min = new Date();
let max = new Date();
let rightTime = false;

let seatMap = new Map();

let photoUrl;

let hasLoad = false;

$(function () {
    layui.use('laydate', function () {
        let laydate = layui.laydate;


        min.setTime(min.getTime() + 30 * 24 * 60 * 60 * 1000);
        max.setTime(max.getTime() + 31 * 24 * 60 * 60 * 1000);
        console.log(`${min.Format("yyyy-MM-dd hh:mm:ss")} - ${max.Format("yyyy-MM-dd hh:mm:ss")}`);

        //执行一个laydate实例
        laydate.render({
            elem: '#time-picker',
            type: 'datetime',
            theme: '#1E9FFF',
            range: true,
            min: 30,
            max: 120,
            value: `${min.Format("yyyy-MM-dd hh:mm:ss")} - ${max.Format("yyyy-MM-dd hh:mm:ss")}`,
            done: function (value, date, endDate) {
                min = new Date(date.year, date.month - 1, date.date, date.hours, date.minutes, date.seconds, 0);
                max = new Date(endDate.year, endDate.month - 1, endDate.date, endDate.hours, endDate.minutes, endDate.seconds, 0);
                rightTime = false;
            }

        });
    });

    initSeat();
});

$(function () {
    layui.use('upload', function(){
        let upload = layui.upload;

        //执行实例
        upload.render({
            elem: '#upload-btn' //绑定元素
            ,url: '/api/activities/upload' //上传接口
            ,done: function(res){
                photoUrl = res.url;
                let photo = `<img src=/showpic/${photoUrl} style="height: 100px;width: auto"/>`;
                $("#upload-ok").css("display", "");
                $("#upload-btn").addClass("layui-btn-disabled").after(photo);
                console.log(photoUrl);
                hasLoad = true;
            }
            ,error: function(e){
                alertWindow(e.responseText);
            }
        });
    });
});

function validateTime() {
    $.post("/api/activities/validate", {
        fromDate: min,
        toDate: max,
        venueCode: sessionStorage.getItem("venueCode")
    }).done(function (date) {
        if (date) {
            $("#ok-icon").css("display", "");
            $("#wrong-icon").css("display", "none");
            rightTime = true;
        } else {
            $("#ok-icon").css("display", "none");
            $("#wrong-icon").css("display", "");
            rightTime = false;
            alertWindow("时间和已发布活动冲突");
        }
    })
}

function uploadData() {
    saveData();
    let activityName = $("#activityName").val();
    let activityType = $("#activity-type").val();
    let description = $("#description").val();
    if (!activityType || !activityName || !description || seatMap.size === 0) {
        alertWindow("请将信息填写完整");
        return;
    }

    if (!rightTime) {
        $.post("/api/activities/validate", {
            fromDate: min,
            toDate: max,
            venueCode: sessionStorage.getItem("venueCode")
        }).done(function (date) {
            if (date) {
                $("#ok-icon").css("display", "");
                $("#wrong-icon").css("display", "none");
                rightTime = true;
                publish(activityName, activityType, description);
            } else {
                $("#ok-icon").css("display", "none");
                $("#wrong-icon").css("display", "");
                rightTime = false;
                alertWindow("时间和已发布活动冲突");
            }
        })
    } else {
        publish(activityName, activityType, description);
    }

}

function publish(activityName, activityType, description) {
    layer.open({type: 3});
    $.post("/api/activities/publish", {
        activityName: activityName,
        activityType: activityType,
        startTime: min,
        endTime: max,
        description: description,
        seatMapString: map2Str(seatMap),
        photoUrl: '1',
        venueCode: sessionStorage.getItem("venueCode")
    }).done(function (data) {
        alertWindowCtrl("发布成功<br>活动编号：" + data, "/venue/activity");
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
}

function map2Str(map) {
    let objList = [];
    for (let [k, v] of map) {
        objList.push({seatId: k, price: v});
    }
    return JSON.stringify(objList);
}

Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
