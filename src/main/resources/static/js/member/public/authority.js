/**
 * http://usejsdoc.org/
 */
function member_login() {
	layer.open({
        type: 0,
        title: '登录',
        area: ['400px', '280px'],
        content:
            `<div class='label-bar'>
                <label>邮箱</label>
                <input id="account_login" class="input" type="email"/>
            </div>
            <div class='label-bar'>
                <label>密码</label>
                <input id="password_login" class="input" type="password"/>
            </div>`,
        btn: ['登录', '取消'],
        yes: function (index) {
        	postLogin(index);
        },
        btn2: function (index) {
            layer.close(index);
        }
    });
}

function member_register() {
	layer.open({
        type: 0,
        title: '注册',
        area: ['400px', '280px'],
        content:
            `<div class='label-bar'>
                <label>邮箱</label>
                <input id="account_register" class="input" type="email"/>
            </div>
            <div class='label-bar'>
                <label>用户名</label>
                <input id="username_register" class="input" type="text"/>
            </div>
        	<div class='label-bar'>
        	<label>密码</label>
        	<input id="password_register" class="input" type="password"/>
        	</div>
            <div class='label-bar'>
                <label>确认密码</label>
                <input id="repeat_password_register" class="input" type="password"/>
            </div>`,
        btn: ['注册', '取消'],
        yes: function (index) {
        	postRegister(index);
        },
        btn2: function (index) {
            layer.close(index);
        }
    });
}

function postLogin() {
	let email = $("#account_login").val();
    let password = $("#password_login").val();
    $.post("/api/members/login", {
        "email": email,
        "password": password
    }).done(function (data) {
        changeHeader(data);
        console.log(data);
        window.location.href = "/member/activity";
        // alertWindow("用户名或密码错误");
    }).fail(function (xhr) {
        alertWindow(xhr.responseText);
        // console.log(xhr)
    });
}

function postRegister() {
    let email = $("#account_register").val();
    let username = $("#username_register").val();
    let password = $("#password_register").val();
    let repeat = $("#repeat_password_register").val();
    if (!(username && email && password && repeat)) {
        alertWindow("请将信息填写完整");
        return;
    }
    if (repeat !== password) {
        alertWindow("请输入一致的密码");
        return;
    }
    $.post("/api/members/sign-up", {
        username: username,
        email: email,
        password: password
    }).done(function (data) {
        alertWindowCtrl("注册成功，请注意查收邮件。", "/member/");
    }).fail(function (e) {
        alertWindow(e.responseText);
    })
}

