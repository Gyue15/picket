let memberData;

$(function () {
    //initPersonHeader();
    $.get("/api/members", {
        email: localStorage.getItem("memberEmail")
    }).done(function (data) {
        memberData = data;

        updateMemberData();
    });
});

function initPersonHeader() {
    let crumb = `
<div id="crumb">
  <a href="/">首页</a>
  >
  <a id="cite">个人中心</a>
</div>`;
    $("#header-menu").append(crumb);
}

function updateMemberData() {
    let nextPoint = 0, discount;
    if (memberData.level < 10) {
        nextPoint = (memberData.level + 1) * 5000 - memberData.point;
    }
    discount = (100 - memberData.level * 3) * 0.1;
    discount = discount.toFixed(1);
    console.log(memberData);
    $("#name").text(memberData.username);
    $("#email").text(memberData.email);
    $("#level").text(memberData.level);
    var levelParent = $($("#level").parent().get(0));
    levelParent.attr("title", `购票时可获得${discount}折优惠（会员等级优惠在优惠券使用之前计算）`);
    levelParent.attr("data-toggle", "tooltip");
    levelParent.attr("data-placement", "top");
    levelParent.tooltip();
    $("#point").text(memberData.point);
    var pointParent = $($("#point").parent().get(0));
    pointParent.attr("title", `距下一级还剩${nextPoint}点积分，每消费1元可获得10点积分`);
    pointParent.attr("data-toggle", "tooltip");
    pointParent.attr("data-placement", "top");
    pointParent.tooltip();
    var pointParent = $($("#email").parent().get(0));
    pointParent.attr("title", "邮箱在注册后不可更改");
    pointParent.attr("data-toggle", "tooltip");
    pointParent.attr("data-placement", "top");
    pointParent.tooltip();
    var pointParent = $($("#name").parent().get(0));
    pointParent.attr("title", "昵称会出现在评论中");
    pointParent.attr("data-toggle", "tooltip");
    pointParent.attr("data-placement", "top");
    pointParent.tooltip();
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
    console.log(memberData);
    let e = event || window.event;
    if (e.keyCode === 13 && $(`#${inputId}`).val()) {
        $(obj).css("display", "");
        $(`#${beforeId}`).css("display", "");
        $(`#${inputId}`).parent().css("display", "none");
        memberData[attr] = $(`#${inputId}`).val();
        $("#confirm-btn").removeClass("layui-btn-disabled");
        updateMemberData();
    }
}

function confirmEdit() {
    $.post("/api/members/modify", memberData).done(function () {
        alertWindow("修改成功！");
        setTimeout(function(){window.location.href = "/member/person";}, 1000);

    }).fail(function (e) {
        alertWindow(e.responseText);
    })
}

let voucherTypes;

function getVoucher() {

    $.get("/api/members/voucher-types", {
        email: localStorage.getItem("memberEmail")
    }).done(function (data) {
        voucherTypes = data;
        displayVoucher();
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
    
}

function displayVoucher() {
    let select = '';
    voucherTypes.map(function (item) {
        select += `<option value=${item.voucherTypeId}>${item.description}</option>`;
    });

    // setOutputEnd(select);
    layer.open({
        type: 0,
        title: '填充信息',
        area: ['420px', '240px'],
        content:
            `<div class="label-bar">
                <label>选择优惠券类型</label>
                <select id="voucher-type" name="price-type" class="layer-select">
                    ${select}
                </select>
            </div>
            <div class="label-bar">
                <label>填写购买张数</label>
                <input id="num" class="layer-input" type="number"  min="1" max="20"/>
            </div>
            `,
        btn: ['确认兑换', '取消'],
        yes: function (index) {
            changeVoucher();
            layer.close(index);
        },
        btn2: function (index) {
            layer.close(index);
        }
    });
}

function changeVoucher() {
    let voucherTypeId = $("#voucher-type").val() - 0;
    let num = $("#num").val() ;
    if (num <= 0) {
        alertWindow("请至少兑换一张！");
        return;
    }
    $.post("/api/members/change-vouchers", {
        email: localStorage.getItem("memberEmail"),
        voucherTypeId: voucherTypeId,
        num: num
    }).done(function () {
        alertWindow("兑换成功");
        setTimeout(function(){window.location.href = "/member/person";}, 1000);
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
}

function abolish() {
    layer.open({
        type: 0,
        title: '警告',
        area: ['300px', '200px'],
        content:
            `<strong style="color: red; margin: 60px auto; width: 160px; text-align: center; font-size: 16px">会员停止后不可恢复</strong>`,
        btn: ['确认', '取消'],
        yes: function (index) {
            $.post("/api/members/abolish", {
                email: localStorage.getItem("memberEmail")
            }).done(function () {
                layer.close(index);
                logout();
            });

        },
        btn2: function (index) {
            layer.close(index);
        }
    });

}

function changePassword() {
    layer.open({
        type: 0,
        title: '填充信息',
        area: ['400px', '280px'],
        content:
            `<div class='label-bar'>
                <label>当前密码</label>
                <input id="old-password" class="input" type="password"/>
            </div>
            <div class='label-bar'>
                <label>新密码</label>
                <input id="new-password" class="input" type="password"/>
            </div>
            <div class='label-bar'>
                <label>确认新密码</label>
                <input id="repeat-password" class="input" type="password"/>
            </div>`,
        btn: ['确认', '取消'],
        yes: function (index) {
            postChangePassword(index);
        },
        btn2: function (index) {
            layer.close(index);
        }
    });
}

function postChangePassword(index) {
    let old = $("#old-password").val();
    let newPassword = $("#new-password").val();
    let repeat = $("#repeat-password").val();
    if (!old || !newPassword || !repeat) {
        alertWindow("请填写完整");
        return;
    }
    if (newPassword !== repeat) {
        alertWindow("两次密码请填写一致");
        return;
    }
    console.log(old, newPassword, repeat);
    $.post("/api/members/change-password", {
        email: localStorage.getItem("memberEmail"),
        newPassword: newPassword,
        oldPassword: old
    }).done(function () {
        layer.close(index);
        alertWindow("修改成功");
        setTimeout(function(){window.location.href = "/member/person";}, 1000);
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
    
}