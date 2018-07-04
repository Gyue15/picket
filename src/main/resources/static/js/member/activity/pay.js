let voucherId = -1;
let payMethod = "ALIPAY";

let orignMoney, memberDiscount;

let discount = new Map();

let confirmed = false;

$(function () {
    $.get("/api/activities/place-date", {
        "order-id": getUrlParam("signature")
    }).done(function (data) {
        initLayui(data);
    }).fail(function (e) {
        alertWindow(e.responseText);
    })


});

$(function () {
    $.get("/api/activities/pay-messages", {
        email: localStorage.getItem("memberEmail"),
        signature: getUrlParam("signature")
    }).done(function (data) {
        memberDiscount = data.memberDiscount;
        let voucher = "<option value='-1'>不使用</option>";
        data.voucherModelList.map(function (object) {
            voucher += `<option value=${object.voucherId}>满${object.leastMoney}减${object.discountMoney}</option>`;
            discount.set(object.voucherId, object.discountMoney);
        });
        $("#voucher").empty().append(voucher);
        layui.use('form', function () {
            layui.form.render('select');
            layui.form.on('select(pay-method)', function (data) {
                payMethod = data.value;
                console.log(payMethod);
            });
            layui.form.on('select(voucher)', function (data) {
                voucherId = data.value - 0;
                console.log(voucherId);
                $("#pay-value").text(`原价${orignMoney}元，优惠价：
                    ${orignMoney * memberDiscount - (discount.get(voucherId)?discount.get(voucherId):0)}元`);
            });
        });
        $("#pay-value").text(`原价${data.money}元，优惠价：${(data.money * data.memberDiscount).toFixed(2)}元`);
        console.log(data);
        orignMoney = data.money;
        
        let activityType = getUrlParam("atype");
        let activityName = getUrlParam("aname");
        let activityId = getUrlParam("aid");
        let crumb = `
    <div id="crumb" style="margin:10px auto 0 auto;display:flex;width:80%;padding:20px 0 0 5px;">
      <a href="/">首页</a>
      >
      <a href="/member/activity?type=${activityType}">${activityType}</a>
      >
      <a href="/member/activity/detail?activityId=${activityId}">${activityName}</a>
      >支付
    </div>`;
        $("#header-menu").after(crumb);
        
        $.get("/api/orders/" + getUrlParam("signature"))
        .done(function (orderModel) {
        	$("#pay-ticket-info").append(`<div class="pay-item-container"><label class='layui-form-label larger'>演出名称</label><div class='layui-input-block'><div class='pay-value'>${orderModel.activityName}</div></div></div>`);
        	$("#pay-ticket-info").append(`<div class="pay-item-container"><label class='layui-form-label larger'>演出场馆</label><div class='layui-input-block'><div class='pay-value'>${orderModel.venueName}</div></div></div>`);
        	$("#pay-ticket-info").append(`<div class="pay-item-container"><label class='layui-form-label larger'>开始时间</label><div class='layui-input-block'><div class='pay-value'>${orderModel.beginDateString}</div></div></div>`);
        	$("#pay-ticket-info").append(`<div class="pay-item-container"><label class='layui-form-label larger'>座位</label><div class='layui-input-block'><div class='pay-value'>${orderModel.seatNameList}</div></div></div>`);
        	console.log(orderModel);
        }).fail(function (e) {
        	alertWindow(e.responseText);
        });
        
    });
});

function initLayui(data) {
    layui.use('util', function () {
        let util = layui.util;

        let endTime = data + 15 * 60 * 1000;

        console.log(new Date(data));

        util.countdown(endTime, new Date().getTime(), function (date, serverTime) {
            let str = date[2] + '分' + date[3] + '秒';
            layui.$('#time-count').html('支付时间还剩：' + str);
            // console.log(endTime, serverTime, endTime === serverTime);
            if (endTime === serverTime) {
                $.post("/api/activities/unlock", {
                    lockSign: getUrlParam("signature")
                }).done(function () {
                    alertWindowCtrl("您支付已超时", "/member/activity");
                }).fail(function (e) {
                    alertWindow(e.responseText);
                })
            }
        });
    });
}

function pay() {
    if (!confirmed) {
        confirmed = true;
        let payId = $("#payId").val();
        let password  =$("#payPassword").val();

        if (!payId || !password) {
            alertWindow("请填写支付账号和密码");
            return;
        }

        $.post("/api/activities/pay-order", {
            orderId: getUrlParam("signature"),
            payMethod: payMethod,
            payId: payId,
            password: password,
            email: localStorage.getItem("memberEmail"),
            voucherId: voucherId
        }).done(function () {
            alertWindow("购买成功，正在跳转到订单页面");
            setTimeout(function(){window.location.href = "/member/order";}, 1500);

        }).fail(function (e) {
            alertWindow(e.responseText);
        })
    }
}

let flag = false;

function unPay() {
    $.post("/api/activities/pay-cancel", {
        orderId: getUrlParam("signature"),
        email: localStorage.getItem("memberEmail")
    }).done(function () {
        flag = true;
        alertWindow("已取消支付，正在跳转到演出页面");
        setTimeout(function(){window.location.href = "/member/activity";}, 1500);
    }).fail(function (e) {
        alertWindow(e.responseText);
    })
}

// function confirmLeave() {
//     if (flag) {
//         return;
//     }
//     $.post("/api/activities/pay-cancel", {
//         orderId: getUrlParam("signature"),
//         email: localStorage.getItem("email")
//     }).done(function () {
//         alert("支付取消！");
//         // window.location.href = "/member/activity";
//     }).fail(function (e) {
//         alertWindow(e.responseText);
//     })
// }

