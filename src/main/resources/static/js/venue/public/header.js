$(function () {
    if (!localStorage.getItem("venueIsLogin")
        && this.location.href !== "http://localhost:8080/venue/"
        && this.location.href !== "http://localhost:8080/venue/login"
        && this.location.href !== "http://localhost:8080/venue/signUp") {
        window.location.href = "/venue/";
    }
    updateHeader();

});

function updateHeader() {
    $("a:hover").css("color", "#FFC53D");

    let header = "";
    if (localStorage.getItem("venueIsLogin")) {
        header = `<ul>
                <li>
                    <a id="picket" href="/venue/activity">Picket</a>
                </li>
                <li>
                     <a id="another-enter" class="header-item" href="/member/activity">会员入口</a>
                </li>
                <li>
                    <a id="signUp" class="header-item" onclick="logout()" style="cursor: pointer">登出</a>
                </li>
                <li>
                    <p id="welcome" class="header-item">欢迎，${localStorage.venueName}</p>
                </li>
                <li>
                    <div class="y-line"></div>
                </li>
                <li>
                    <a id="publish" class="header-item" href="/venue/activity/publish">发布</a>
                </li>
                <li>
                    <a id="check" class="header-item" style="cursor: pointer" onclick="check()">检票</a>
                </li>
                <li>
                    <input id="check-input" type="text" placeholder="请输入检票码"/>
                </li>
            </ul>`;
        $("#header").empty().append(header);

    } else {
        header = `<ul>
                <li>
                    <a id="picket" href="/venue/">Picket</a>
                </li>
                <li>
                     <a id="another-enter" class="header-item" href="/member/activity">会员入口</a>
                </li>
                <li>
                    <a id="signUp" class="header-item" href="/venue/signUp">注册</a>
                </li>
                <li>
                    <a id="login" class="header-item" href="/venue/login">登录</a>
                </li>
            </ul>`;
        $("#header").empty().append(header);
    }

}

function login() {
    let venueCode = $("#venue-code").val();
    let password = $("#password").val();
    $.post("/api/venues/login", {
        "venueCode": venueCode,
        "password": password
    }).done(function (data) {
        changeHeader(data);
        window.location.href = "/venue/activity";
    }).fail(function (xhr) {
        alertWindow(xhr.responseText);
    });
}

function changeHeader(data) {
    localStorage.setItem("venueName", data["venueName"]);
    localStorage.setItem("venueCode", data["venueCode"]);
    localStorage.setItem("venueIsLogin", true);
    // alert(localStorage.getItem("username") + " "  +localStorage.getItem("signature"));
    updateHeader();
}

function logout() {
    localStorage.removeItem("venueName");
    localStorage.removeItem("venueCode");
    localStorage.removeItem("venueIsLogin");
    updateHeader();
    window.location.href = "/venue/";
}

function check() {
    let ticketCode = $("#check-input").val();
    $.post("/api/orders/check", {
        ticketCode: ticketCode,
        venueCode: localStorage.getItem("venueCode")
    }).done(function (data) {
        if (data.message === "success") {
            alertWindowBigger(`<div class='alert-tip'><strong>检票成功！</strong><br><br>演出：${data.activityName}<br>取票码：${ticketCode}</div>`);
        } else {
            alertWindowBigger("<div class='alert-tip'><strong>没有找到这张票，</strong><br><br>请仔细核对检票码</div>");
        }
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
}
