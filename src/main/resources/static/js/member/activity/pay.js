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
        email: sessionStorage.getItem("memberEmail"),
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
        $("#pay-value").text(`原价${data.money}元，优惠价：${data.money * data.memberDiscount}元`);
        console.log(data);
        orignMoney = data.money;
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
            email: sessionStorage.getItem("memberEmail"),
            voucherId: voucherId
        }).done(function () {
            alertWindowCtrl("购买成功", "/member/order")
        }).fail(function (e) {
            alertWindow(e.responseText);
        })
    }
}

let flag = false;

function unPay() {
    $.post("/api/activities/pay-cancel", {
        orderId: getUrlParam("signature"),
        email: sessionStorage.getItem("email")
    }).done(function () {
        flag = true;
        window.location.href = "/member/activity";
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
//         email: sessionStorage.getItem("email")
//     }).done(function () {
//         alert("支付取消！");
//         // window.location.href = "/member/activity";
//     }).fail(function (e) {
//         alertWindow(e.responseText);
//     })
// }

