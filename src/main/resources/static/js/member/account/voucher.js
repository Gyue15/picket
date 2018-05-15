let nowPage = 1;
let maxPage = 1;

$(function () {
    $.get("/api/members/vouchers-page-numbers", {
        "email": sessionStorage.getItem("memberEmail"),
        "page-size": 5
    }).done(function (data) {
        maxPage = data - 0;
    }).done(function () {
        updateList();
        updatePageNum();
    });
});

function displayList(data) {
    let voucher = "";
    for (let i = 0; i < data.length; i++) {
        let date = new Date(data[i].leastDate);
        voucher += `<div class="row">
            <div class="col-md-2">
            </div>
            <div class="voucher-item col-md-8 voucher-able">
                <p class="voucher-title able">满${data[i].leastMoney}减${data[i].discountMoney}</p>
                <p class="voucher-time able">有效期至：${date.Format("yyyy-MM-dd hh:mm:ss")}</p>
            </div>
            <div class="col-md-2">
            </div>
        </div>`;
    }
    for (let i = 5 - data.length; i > 0; i--) {
        voucher += "<div class=\"voucher-item voucher-hidden\"></div>";
    }

    $("#v-container").empty().append(voucher);
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
    $.get("/api/members/vouchers", {
        "email": sessionStorage.getItem("memberEmail"),
        "page": nowPage,
        "page-size": 5
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