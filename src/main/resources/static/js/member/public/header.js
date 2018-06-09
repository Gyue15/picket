$(function () {
    if (!sessionStorage.getItem("memberIsLogin")
        && this.location.href !== "http://localhost:8080/member/"
        && this.location.href !== "http://localhost:8080/member/login"
        && this.location.href !== "http://localhost:8080/member/signUp") {
        window.location.href = "/member/";
    }
    updateHeader();
});

function updateHeader() {
    let header = "";
    if (sessionStorage.getItem("memberIsLogin")) {
        header = `<ul>
                <li>
                    <a id="picket" href="/member/">Picket</a>
                </li>
                <li>
                     <a id="another-enter" class="header-item" href="/venue/">场馆入口</a>
                </li>
                <li>
                    <a id="signUp" class="header-item" onclick="logout()" style="cursor: pointer">登出</a>
                </li>
                <li>
                    <a id="login" class="header-item" href="/member/person">欢迎，${sessionStorage.getItem("username")}</p>
                </li>
                <li>
                    <div class="y-line"></div>
                </li>
                <li>
                    <a id="m-search" class="header-item" style="cursor: pointer" onclick="searchActivity()">搜索</a>
                </li>
                <li>
                    <input id="m-search-input" type="text" placeholder="请输入关键词"/>
                </li>
            </ul>`;
    } else {
        header = `<ul>
                <li>
                    <a id="picket" href="/member/">Picket</a>
                </li>
                <li>
                     <a id="another-enter" class="header-item" href="/venue/activity">场馆入口</a>
                </li>
                <li>
                    <a id="signUp" class="header-item" href="/member/signUp">注册</a>
                </li>
                <li>
                    <a id="login" class="header-item" href="/member/login">登录</a>
                </li>
            </ul>`;
    }
    $("#header").empty().append(header);
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
    let keyword = $("#search-input").val();
    if (!keyword) {
        alertWindow("请输入关键词");
        return;
    }
    window.location.href = `/member/activity/search?keyword=${keyword}`;
}