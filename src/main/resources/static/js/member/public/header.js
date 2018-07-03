let firstTimeRender = true;
let notifications = [];

let type = 'all';

$.getScript("/js/member/public/city.js", function() {
    addGlobalCSS();
    updateHeader();
    setUpWebSocket();
    updateCity();
});

function addGlobalCSS() {
    // 为所有页面统一添加fontawesome和animate的css支持
    let head = document.getElementsByTagName('head')[0];
    if (head) {
        let fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.setAttribute('rel', 'stylesheet');
        fontAwesomeLink.setAttribute('href', 'https://use.fontawesome.com/releases/v5.1.0/css/all.css');
        fontAwesomeLink.setAttribute('integrity', 'sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt');
        fontAwesomeLink.setAttribute('crossorigin', 'anonymous');
        head.appendChild(fontAwesomeLink);

        let animateLink = document.createElement('link');
        animateLink.setAttribute('rel', 'stylesheet');
        animateLink.setAttribute('href', '/css/lib/animate.css');
        head.appendChild(animateLink);
    }
}

function updateHeader() {
    type = getUrlParam("type") || "all";
    let headerMenu = ``;
    console.log(window.location.href);
    if (!getUrlParam('activityId') && !window.location.href.match('.*/member/order.*') && !window.location.href.match('.*/member/person.*')) {
        headerMenu = `<a id="all" class="header-menu-item" href='/'>首页</a>
        <a id="演唱会" class="header-menu-item" href='/member/activity?type=演唱会'>演唱会</a>
        <a id="音乐会" class="header-menu-item" href='/member/activity?type=音乐会'>音乐会</a>
        <a id="话剧" class="header-menu-item" href='/member/activity?type=话剧'>话剧</a>
        <a id="海外" class="header-menu-item" href='/member/activity?type=海外'>海外</a>
        <a id="乐团" class="header-menu-item" href='/member/activity?type=乐团'>乐团</a>
        <a id="戏剧歌剧" class="header-menu-item" href='/member/activity?type=戏剧歌剧'>戏剧歌剧</a>
        <a id="舞剧" class="header-menu-item" href='/member/activity?type=舞剧'>舞剧</a>
        <a id="舞台剧" class="header-menu-item" href='/member/activity?type=舞台剧'>舞台剧</a>`;
    }

    if (window.location.href.match('.*/member/order.*')) {
        headerMenu = `<div id="crumb">
                        <a href="/">首页</a>
                        >
                        <a id="cite">我的订单</a>
                       </div>`;
    }
    if (window.location.href.match('.*/member/person.*')) {
        headerMenu = `<div id="crumb">
                        <a href="/">首页</a>
                        >
                        <a id="cite">个人中心</a>
                       </div>`;
    }

        let header = "";
    if (localStorage.getItem("memberIsLogin")) {
        header = `<div id="inner-header">
        <div class="left-header-container">
            <!--<div class="header-item left-item">Hi ${localStorage.getItem("username")}，欢迎来到<a href="/">Picket</a></div>-->
        </div>
        <div class="right-header-container">
            <div class="header-item right-item pointer" onclick="logout()">登出</div>
            <a class="header-item right-item pointer" href="/member/person" id="person-header">个人中心</a>
            <a class="header-item right-item pointer" href="/member/order" id="order-header">我的订单</a>
            <tooltip id="no-notification">
                <label value="当前没有通知"/>
            </tooltip>
            <a class="header-item right-item pointer" href="javascript:void(0);" id="notification-header" onclick="openNotification()"><i class="far fa-bell"></i></a>
            <a href="javascript:void(0);" id="notification-float" class="animated" onclick="openNotification()"><i class="far fa-bell"></i><p id="notification-float-number"></p></a>
        </div>
    </div>`;
    } else {
        header = `<div id="inner-header">
        <div class="left-header-container">
            <!--<div class="header-item left-item">Hi，欢迎来到Picket</div>-->
        </div>
        <div class="right-header-container">
            <div class="header-item right-item pointer" id="registerButton" onclick="member_register()"">注册</div>
            <div class="header-item right-item pointer" id="loginButton" onclick="member_login()">登录</div>
        </div>
    </div>`;
    }
    let subHeader = `
    <div id="site-name-bar">
        <div id="site-name"><a href="/">Picket</a></div>
        <div id="city" onclick="switchCity()"><div id="city-name" style="float: left">${cityName}</div><i id="down-icon" class="xiala">&#xe641;</i><i id="up-icon" class="xiala" style="display: none">&#xe798;</i></div>
        <div id="search-bar">
            <input id="search-bar-input" type="text"/>
            <button id="search-bar-button" onclick="searchActivity()">搜索</button>
        </div>
    </div>

    <hr style="width: 100%">
    <div id="header-menu">
    ${headerMenu}
    </div>`;


    $("#header").empty().append(header + subHeader);
    if (this.location.href.match('.*/member/order.*')) {
        $("#order-header").css("border-bottom", "3px solid #e98074");
    }
    else if (this.location.href.match('.*/member/person.*')) {
        $("#person-header").css("border-bottom", "3px solid #e98074");
    }

    let searchBarInput = document.getElementById("search-bar-input");
    searchBarInput.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            searchActivity();
        }
    });

    $(`#${type}`).addClass("active");


}

/* 从服务器端取通知 */
function setUpWebSocket() {
    const socket = new WebSocket('ws://localhost:8080/notification');
    socket.addEventListener('open', function (event) {
        socket.send(localStorage.getItem('memberEmail'));
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        try {
            if (JSON.parse(event.data)) {
                if (Notification.permission === "default") {
                    Notification.requestPermission().then(function(result) {
                        console.log(result);
                    });
                }
                updateNotification(JSON.parse(event.data));
                console.log("update");
            }
        } catch (SyntaxError) {
            // 
        }
    });

    window.addEventListener('close', function () {
        socket.close();
    })

}

function updateNotification(activityNameList) {
    if (JSON.stringify(localStorage.getItem("notifications")) === JSON.stringify(activityNameList)) {

    }
    notifications = activityNameList;
    // TODO: 修改通知图标
    if (!firstTimeRender) {
        document.styleSheets[0].deleteRule(0);
    } else {
        firstTimeRender = false;
    }
    if (notifications.length > 0) {
        if (Notification.permission === "granted" && localStorage.getItem("notifications") !== JSON.stringify(activityNameList)) {
            let n = new Notification("Picket: 你关注的活动有票啦！");
            n.onclick = function(event) {
                event.preventDefault();
                window.open('http://localhost:8080', '_blank');
              }
            localStorage.setItem("notifications", JSON.stringify(activityNameList));
        } else {
            console.log("no update")
        }
        document.styleSheets[0].insertRule(`#notification-header:after { content: "${notifications.length}"; color: #e85a4f; font-size: 5px; position: absolute; top: 2px;}`, 0);
        $("#notification-header").attr('tooltip', '');
        $("#notification-float").css({'display':'flex', 'position':'fixed'}).addClass("rubberBand");
        $("#notification-float-number").text(notifications.length);
    } else {
        document.styleSheets[0].insertRule(`#notification-header:after { content: ""; color: #e85a4f; font-size: 5px; position: absolute; top: 2px;}`, 0);
        $("#notification-header").attr('tooltip', "'no-notification'");
        $("#notification-float").css('display', 'none');
        $("#notification-float-number").text('');
    }
}

function member_login() {
    layer.open({
        type: 0,
        title: ' ',
        area: ['400px', '280px'],
        content:
            `<div id="loginPanel">
	            <div class='label-bar input-group'>
	                <span class="input-group-addon">邮箱</span>
	                <input id="account_login_email" class="input" type="email" name="email" required autocomplete="email"/>
	            </div>
	            <div class='label-bar input-group'>
	                <span class="input-group-addon">密码</span>
	                <input id="password_login" class="input" type="password" required name="password"/>
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
    let emailInput = document.getElementById("account_login_email");
    emailInput.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementsByClassName("layui-layer-btn0")[0].click();
        }
    });
    let pwInput = document.getElementById("password_login");
    pwInput.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementsByClassName("layui-layer-btn0")[0].click();
        }
    });
    var loginTitle = $("#loginPanel").parent().parent().children().first();
    loginTitle.css("background-color", "#e85a4f");
    loginTitle.css("color", "white");
    loginTitle.append("<div class='glyphicon glyphicon-user'></div>");
    var loginBtn = $("#loginPanel").parent().parent().children().eq(3).children().eq(0);
    loginBtn.css("background-color", "#e85a4f");
    loginBtn.css("border-color", "#e85a4f");
}

function openNotification() {
    if (notifications.length > 0) {
        layer.open({
            type: 0,
            area: ['500px'],
            maxHeight: 400,
            scrollbar: true,
            title: '我关注的活动 <i class="far fa-question-circle" title="可以在活动详情页面取消关注"></i>',
            content: `${(function () {
                let result = '';
                let i;
                for (i = 0; i < notifications.length; i = i + 1) {
                    result = result + 
                    `<div class="notification-item">
                        <a href="/member/activity/detail?activityId=${notifications[i].id}">
                            <img src="/showpic/${notifications[i].id}.jpg" width="56px" height="70px">
                            <div class="notification-text">
                                <p class="title">
                                    ${notifications[i].name}
                                </p>
                                <p class="content">
                                    已有余票，点击查看
                                </p> 
                            </div>
                        </a>
                    </div>`
                }
                return result;
            })()}`,
            btn: ['等会儿再去看']
        })
    }
}

function member_register() {
    layer.open({
        type: 0,
        title: ' ',
        area: ['400px', '400px'],
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
    var registerTitle = $("#registerPanel").parent().parent().children().first();
    registerTitle.css("background-color", "#e85a4f");
    registerTitle.css("color", "white");
    registerTitle.append("<div class='glyphicon glyphicon-user'></div>");
    var registerBtn = $("#registerPanel").parent().parent().children().eq(3).children().eq(0);
    registerBtn.css("background-color", "#e85a4f");
    registerBtn.css("border-color", "#e85a4f");
}

function postLogin(index) {
    let email = $("#account_login_email").val();
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
    localStorage.setItem("username", data.username);
    localStorage.setItem("memberEmail", data.email);
    localStorage.setItem("memberIsLogin", true);
    // alert(localStorage.getItem("username") + " "  +localStorage.getItem("signature"));
    updateHeader();
}

function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("memberEmail");
    localStorage.removeItem("memberIsLogin");
    updateHeader();
    window.location.href = "/"
}

function searchActivity() {
    let keyword = $("#search-bar-input").val();
    if (!keyword) {
        alertWindow("请输入关键词");
        return;
    }
    window.location.href = `/member/activity?keyword=${keyword}&type=${type}`;
}