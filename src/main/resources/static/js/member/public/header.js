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
            <div class="header-item left-item">Hi，欢迎来到Picket</div>
            <div class="header-item left-item pointer" onclick="logout()">登出</div>
        </div>
        <div class="right-header-container">
            <a class="header-item right-item pointer" href="/member/person">个人中心</a>
            <a class="header-item right-item pointer" href="/member/tickets">我的订单</a>
        </div>
    </div>`;
    } else {
        header = `<div id="inner-header">
        <div class="left-header-container">
            <div class="header-item left-item">Hi，欢迎来到Picket</div>
            <div class="header-item left-item pointer" id="loginButton" onclick="member_login()">登录</div>
            <div class="header-item left-item pointer" id="registerButton" onclick="member_register()"">注册</div>
        </div>
        <div class="right-header-container">
            <a class="header-item right-item pointer" href="/member/person">个人中心</a>
            <a class="header-item right-item pointer" href="/member/tickets">我的订单</a>
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

function login() {
    let email = $("#email").val();
    let password = $("#password").val();
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

function signUp() {
    let username = $("#username").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let repeat = $("#repeat").val();
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
    window.location.href = "/member/"
}

function searchActivity() {
    let keyword = $("#search-bar-input").val();
    if (!keyword) {
        alertWindow("请输入关键词");
        return;
    }
    window.location.href = `/member/activity/search?keyword=${keyword}`;
}