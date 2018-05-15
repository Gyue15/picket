let nowPage = 1;
let maxPage = 1;

let pageSize = 2;

$(function () {
    $.get("/api/members/tickets-page-numbers", {
        "email": sessionStorage.getItem("memberEmail"),
        "page-size": pageSize
    }).done(function (data) {
        maxPage = data - 0;
    }).done(function () {
        updateList();
        updatePageNum();
    });
});

function displayList(data) {
    console.log(1, data);
    let voucher = "";
    for (let i = 0; i < data.length; i++) {
        let nowDate = new Date();
        let ticketClass = '';
        if (nowDate.getTime() <= data[i].beginTime + 60 * 60 * 1000) {
            ticketClass = "ticket-able";
        } else {
            ticketClass = "ticket-disable";
        }
        let date = new Date(data[i].beginTime);
        voucher += `<div class="row">
            <div class="col-md-2">
            </div>
            <div class="ticket-item col-md-8 ${ticketClass}">
                <p class="ticket-title able">${data[i].activityName}</p>
                <p class="ticket-info able">${data[i].venueName} ${data[i].seat}</p>
                <p class="ticket-info able">开始时间 ${date.Format("yyyy-MM-dd hh:mm:ss")}</p>
                <p class="ticket-info able">检票码 ${data[i].ticketCode}</p>
                <p class="ticket-info able">已检票： ${data[i].checked ? '是' : '否'}</p>
            </div>
            <div class="col-md-2">
            </div>
        </div>`;
    }
    for (let i = pageSize - data.length; i > 0; i--) {
        voucher += "<div class=\"ticket-item ticket-hidden\"></div>";
    }

    $("#t-container").empty().append(voucher);
}

function turnPage(turnNum) {
    turnNum = turnNum - 0;
    if (nowPage + turnNum <= 0 || nowPage + turnNum > maxPage) {
        return;
    }
    nowPage = nowPage + turnNum;
    updateList();
    updatePageNum();
}

function updateList() {
    $.get("/api/members/tickets", {
        "email": sessionStorage.getItem("memberEmail"),
        "page": nowPage,
        "page-size": pageSize
    }).done(function (data) {
        console.log(data);
        displayList(data);
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
}

function updatePageNum() {
    $("#pageNum").text(`${nowPage}/${maxPage}`);

    if (nowPage > 1) {
        $("#before").addClass("page-active");
        $("#before").removeClass("page-disactive");
    } else {
        $("#before").addClass("page-disactive");
        $("#before").removeClass("page-active");
    }

    if (nowPage < maxPage) {
        $("#after").addClass("page-active");
        $("#after").removeClass("page-disactive");
    } else {
        $("#after").addClass("page-disactive");
        $("#after").removeClass("page-active");
    }

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