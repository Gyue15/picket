$(function () {
    if (!sessionStorage.getItem("managerIsLogin")
        && this.location.href !== "http://localhost:8080/manager/") {
        window.location.href = "/manager/";
    }
    updateHeader();
});

function updateHeader() {
    let header = "";
    if (sessionStorage.getItem("managerIsLogin")) {
        header = `<ul>
                <li>
                    <a id="picket" href="/manager/">Picket</a>
                </li>
                <li>
                    <a id="signUp" class="header-item" onclick="logout()" style="cursor: pointer">登出</a>
                </li>
                <li>
                    <p id="login" class="header-item">欢迎，${sessionStorage.getItem("managerName")}</p>
                </li>
            </ul>`;
    } else {
        header = `<ul>
                <li>
                    <a id="picket" href="/manager/">Picket</a>
                </li>
            </ul>`;
    }
    $("#header").empty().append(header);
}

function login() {
    let managerId = $("#manager-id").val();
    let password = $("#password").val();
    $.post("/api/managers/login", {
        "managerId": managerId,
        "password": password
    }).done(function (data) {
        sessionStorage.setItem("managerIsLogin", true);
        sessionStorage.setItem("managerName", data.managerId);
        window.location.href = "/manager/addVenue";
    }).fail(function (xhr) {
        alertWindow(xhr.responseText);
    });

}

function logout() {
    sessionStorage.removeItem("managerIsLogin");
    sessionStorage.removeItem("managerName");
    window.location.href = "/manager/";
}