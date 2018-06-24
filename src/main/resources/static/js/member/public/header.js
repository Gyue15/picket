let notifications = [
    {
        id: 20,
        name: "陈慧娴［Priscilla－ism］巡回演唱会"
    },
    {
        id: 12,
        name: "Vini Vici At LINX"
    },
];

$(function () {
    // }
    addGlobalCSS();
    updateHeader();
    setUpWebSocket();  
    updateNotification(notifications);  
});

function addGlobalCSS() {
    // 为所有页面统一添加fontawesome的css支持
    let head = document.getElementsByTagName('head')[0];
    if (head) {
      let styleLink = document.createElement('link');
      styleLink.setAttribute('rel', 'stylesheet');
      styleLink.setAttribute('href', 'https://use.fontawesome.com/releases/v5.1.0/css/all.css');
      styleLink.setAttribute('integrity', 'sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt');
      styleLink.setAttribute('crossorigin', 'anonymous');
      head.appendChild(styleLink);
    }
}

function updateHeader() {
    let header = "";
    if (sessionStorage.getItem("memberIsLogin")) {
        header = `<div id="inner-header">
        <div class="left-header-container">
            <div class="header-item left-item">Hi ${sessionStorage.getItem("username")}，欢迎来到<a href="/">Picket</a></div>
        </div>
        <div class="right-header-container">
            <div class="header-item right-item pointer" onclick="logout()">登出</div>
            <a class="header-item right-item pointer" href="/member/person" id="person-header">个人中心</a>
            <a class="header-item right-item pointer" href="/member/order" id="order-header">我的订单</a>
            <a class="header-item right-item pointer" href="javascript:void(0);" id="notification-header" onclick="openNotification()"><i class="far fa-bell"></i></a>
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
    let subHeader = `
    <div id="site-name-bar">
        <div id="site-name"><a href="/">Picket</a></div>
        <div id="search-bar">
            <input id="search-bar-input" type="text"/>
            <button id="search-bar-button" onclick="searchActivity()">搜索</button>
        </div>
    </div>

    <div id="header-menu">
        <a class="header-menu-item" href='/'>首页</a>
        <a class="header-menu-item" href='/member/activity?type=演唱会'>演唱会</a>
        <a class="header-menu-item" href='/member/activity?type=音乐会'>音乐会</a>
        <a class="header-menu-item" href='/member/activity?type=话剧'>话剧</a>
        <a class="header-menu-item" href='/member/activity?type=海外'>海外</a>
        <a class="header-menu-item" href='/member/activity?type=乐团'>乐团</a>
        <a class="header-menu-item" href='/member/activity?type=戏剧歌剧'>戏剧歌剧</a>
    </div>`;

    $("#header").empty().append(header + subHeader);
    if (this.location.href.match('.*/member/order.*')) {
        $("#order-header").css("border-bottom", "3px solid #e98074");
    } 
    else if (this.location.href.match('.*/member/person.*')) {
        $("#person-header").css("border-bottom", "3px solid #e98074");
    }
    
    let searchBarInput = document.getElementById("search-bar-input");
    searchBarInput.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            searchActivity();
        }
    });

    // let href = this.location.href.split("?")[0];
    // $("#header-menu").find("a").each(function () {
    //     console.log(this.href);
    //     if (this.href === href) {
    //         $(this).addClass("header-item-select");
    //     } else {
    //         $(this).removeClass("header-item-select");
    //
    //     }
    // });
}

/* 从服务器端取通知 */
function setUpWebSocket() {
    const head = document.getElementsByTagName('head')[0];
    // if (head) {
    //   const sockJs = document.createElement('script');
    //   sockJs.setAttribute('src', '/webjars/sockjs-client/sockjs.min.js');
    //   head.appendChild(sockJs);

    //   const stomp = document.createElement('script');
    //   stomp.setAttribute('src', '/webjars/stomp-websocket/stomp.min.js');
    //   head.appendChild(stomp);     
    // }
    // const socket = new SockJS('/tickets');
    // stompClient = Stomp.over(socket);
    // stompClient.connect({}, function (frame) {
    //     setConnected(true);
    //     console.log('Connected: ' + frame);
    //     stompClient.subscribe(`/notification/${sessionStorage.getItem("memberEmail")}`, function (eventData) {
    //         updateNotification(JSON.parse(eventData.body).content);
    //     });
    // });
}

function updateNotification(activityNameList) {
    notifications = activityNameList;
    // TODO: 修改通知图标
    if (notifications.length > 0) {
        document.styleSheets[0].insertRule(`#notification-header:after { content: "${notifications.length}"; color: #e85a4f; font-size: 5px; position: absolute; top: 2px;}`, 0);
    } else {

    }
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
    var emailInput = document.getElementById("account_login_email");
    emailInput.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementsByClassName("layui-layer-btn0")[0].click();
        }
    });
    var pwInput = document.getElementById("password_login");
    pwInput.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementsByClassName("layui-layer-btn0")[0].click();
        }
    });
}

function openNotification() {
    layer.open({
        type: 0,
        title: '我关注的活动',
        content: `${(function(){
            let result = '';
            let i;
            for (i = 0; i < notifications.length; i = i + 1) {
                result = result + `<div class="notification-item">你关注的 <a href="/member/activity/detail?activityId=${notifications[i].id}">${notifications[i].name}</a> 现在有票啦！</div>`
            }
            return result;
        })()}`
    })
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
    window.location.href = `/member/activity?keyword=${keyword}`;
}