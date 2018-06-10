$(function () {
    // if (!sessionStorage.getItem("memberIsLogin")
    //     && this.location.href !== "http://localhost:8080/member/"
    //     && this.location.href !== "http://localhost:8080/member/login"
    //     && this.location.href !== "http://localhost:8080/member/signUp") {
    //     window.location.href = "/member/";
    // }
    updateHeader();
});

function updateHeader() {
    let header = "";
    if (sessionStorage.getItem("memberIsLogin")) {
        header = `<div id="inner-header">
        <div class="left-header-container">
            <div class="header-item left-item">Hi ${sessionStorage.getItem("username")}，欢迎来到Picket</div>
        </div>
        <div class="right-header-container">
            <div class="header-item right-item pointer" onclick="logout()">登出</div>
            <a class="header-item right-item pointer" href="/member/person">个人中心</a>
            <a class="header-item right-item pointer" href="/member/tickets">我的订单</a>
        </div>
    </div>`;
    } else {
        header = `<div id="inner-header">
        <div class="left-header-container">
            <div class="header-item left-item">Hi，欢迎来到Picket</div>
        </div>
        <div class="right-header-container">
            <div class="header-item right-item pointer" id="registerButton" onclick="member_register()"">注册</div>
            <div class="header-item right-item pointer" id="loginButton" onclick="member_login()">登录</div>
        </div>
    </div>`;
    }
    let subHeader = `<div id="site-name-bar">
        <div id="site-name">Picket</div>
        <div id="search-bar">
            <input id="search-bar-input" type="text"/>
            <button id="search-bar-button">搜索</button>
        </div>
    </div>

    <div id="header-menu">
        <div class="header-menu-item">演唱会</div>
        <div class="header-menu-item">音乐会</div>
        <div class="header-menu-item">歌剧</div>
        <div class="header-menu-item">话剧</div>
        <div class="header-menu-item">戏剧</div>
    </div>`;

    $("#header").empty().append(header + subHeader);
}

function member_login() {
	layer.open({
        type: 0,
        title: '登录',
        area: ['400px', '280px'],
        content:
        	`<div id="loginPanel">
	            <div class='label-bar input-group'>
	                <span class="input-group-addon">邮箱</span>
	                <input id="account_login" class="input" type="email"/>
	            </div>
	            <div class='label-bar input-group'>
	                <span class="input-group-addon">密码</span>
	                <input id="password_login" class="input" type="password"/>
	            </div>
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
        	`<div id="registerPanel">
	            <div class='label-bar input-group'>
	                <span class="input-group-addon">邮箱</span>
	                <input id="account_register" class="input" type="email"/>
	            </div>
	            <div class='label-bar input-group'>
	                <span class="input-group-addon">用户名</span>
	                <input id="username_register" class="input" type="text"/>
	            </div>
	        	<div class='label-bar input-group'>
	        		<span class="input-group-addon">密码</span>
	        		<input id="password_register" class="input" type="password"/>
	        	</div>
	            <div class='label-bar input-group'>
	                <span class="input-group-addon">确认密码</span>
	                <input id="repeat_password_register" class="input" type="password"/>
	            </div>
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

function postLogin(index) {
	let email = $("#account_login").val();
    let password = $("#password_login").val();
    $.post("/api/members/login", {
        "email": email,
        "password": password
    }).done(function (data) {
        changeHeader(data);
        window.location.href = "/";
        // alertWindow("用户名或密码错误");
    }).fail(function (xhr) {
        alertWindow(xhr.responseText);
        // console.log(xhr)
    });
}

function postRegister(index) {
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


function changeHeader(data) {
    sessionStorage.setItem("username", data.username);
    sessionStorage.setItem("memberEmail", data.email);
    sessionStorage.setItem("memberIsLogin", true);
    // alert(localStorage.getItem("username") + " "  +localStorage.getItem("signature"));
    updateHeader();
}

function logout() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("memberEmail");
    sessionStorage.removeItem("memberIsLogin");
    updateHeader();
    window.location.href = "/"
}

function searchActivity() {
    let keyword = $("#search-bar-input").val();
    if (!keyword) {
        alertWindow("请输入关键词");
        return;
    }
    window.location.href = `/member/activity/search?keyword=${keyword}`;
}