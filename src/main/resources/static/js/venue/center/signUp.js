let venueData = new Object();
venueData.areaList = [];
venueData.seatGraphList = [];
venueData.seatList = [];
let myAreaCode;

$("#next-step-1").click(function () {
    if ($("#venueName").val() === "" || $("#location").val() === "" || $("#email").val() === ""
        || $("#password").val() === "" || $("#description").val() === "") {
        alertWindow("请将信息填写完整");
        return false;
    }

    if ($("#password").val() !== $("#repeat").val()) {
        alertWindow("请输入相同的密码");
        return false;
    }

    venueData.venueName = $("#venueName").val();
    venueData.location = $("#location").val();
    venueData.email = $("#email").val();
    venueData.password = $("#password").val();
    venueData.description = $("#description").val();
    // console.log(JSON.stringify(venueData));

    stepTwo();
});

// $("#next-step-1").trigger("click");
// $("#next-step-2").trigger("click");

function stepTwo() {
    let form =
    `<div class="layui-form-item">
            <button id="next-step-2" class="layui-btn layui-btn-normal layui-btn-fluid" onclick="stepThree()">下一步
            </button>
        </div>`;

    let fabric =
        `<div id="tip-container" class="tip">
            <blockquote id="tip" class="layui-elem-quote">请先绘制区域形状，然后给区域命名。命名前请先选择区域。</blockquote>
        </div>
        <div id='graph'>
            <div id="side-bar">
                <div class="side-bar-item">
                    <div class="side-item-shape">
                        <img id="rect" class="shape" src="/image/Rectangle.png"/>
                    </div>
                </div>
                <div class="side-bar-item">
                    <div class="side-item-shape">
                        <img id="oval" class="shape" src="/image/Oval.png"/>
                    </div>
                </div>
                <div class="side-bar-item">
                    <div class="side-item-shape">
                        <img id="triangle" class="shape" src="/image/Triangle.png"/>
                    </div>
                </div>
                <div class="side-bar-item">
                    <div class="side-item-shape">
                        <img id="polygon" class="shape" src="/image/Polygon.png"/>
                    </div>
                </div>
                <hr class="layui-bg-black">
                <div class="side-bar-item">
                    <button type="button" id="copy" class="side-btn" onclick="copy()">复制</button>
                </div>
                <div class="side-bar-item">
                    <button type="button" id="paste" class="side-btn" onclick="paste()">粘贴</button>
                </div>
                <div class="side-bar-item">
                    <button type="button" id="delete" class="side-btn" onclick="deleteObj()">删除</button>
                </div>
                <hr class="layui-bg-black">
                <div class="side-bar-item">
                    <button type="button" id="fill" class="side-btn" onclick="fill()">填充</button>
                </div>
                <div class="side-bar-item">
                    <button type="button" id="un-fill" class="side-btn" onclick="removeFill()">移除填充</button>
                </div>
                <div class="side-bar-item">
                    <button type="button" id="top" class="side-btn" onclick="toTop()">置顶</button>
                </div>
                <hr class="layui-bg-black">
                <div class="side-bar-item">
                    <button type="button" id="name-area" class="side-btn">命名区域</button>
                </div>  
            </div>
            <canvas id="c"></canvas> 
        </div>`;

    let script =
        `<script type='text/javascript' src='/js/lib/fabric.min.js'></script>
        <script type="text/javascript" src="/js/venue/public/canvas.js"></script>
        <script id="area-script" type="text/javascript" src="/js/venue/center/areaGraph.js"></script>`;

    $("#sign-form").empty().append(form).parent().before(fabric);
    $("#process-tip").text("Step2/4--绘制场馆区域平面图");
    $("body").append(script);

    layui.use('element', function () {
        let element = layui.element;
        element.progress('sign-up', "50%");
    });
}

let areaCodeToName = new Map();

function stepThree() {
    // 首先存储数据
    if (venueData.areaList.length === 0) {
        alertWindow("请至少绘制一个可入座区域");
        return;
    }
    // venueData.areaList = [{"areaCode": 0, "areaName": "A区域"}, {"areaCode": 1, "areaName": "B区域"}];

    let json = JSON.stringify(canvas);
    venueData.areaGraph = json;
    // console.log("json: " + json);
    // console.log("venueData: " + JSON.stringify(venueData));

    let form =
        `<div class="layui-form-item">
            <button id="next-step-3" class="layui-btn layui-btn-normal layui-btn-fluid" onclick="stepFour()">下一步
            </button>
        </div>`;
    let script = `<script type="text/javascript" src="/js/venue/center/seatGraph.js"></script>`;

    let areaSelector =
        `<div id="area-selector-bar">
            <p class="area-selector-tip">选择区域</p>
            <select id="seat-area-selector" name="area" class="area-selector" onchange="saveSeat()">`;
    for (let i = 0; i < venueData.areaList.length; i++) {
        areaSelector = areaSelector +
            `<option value=${venueData.areaList[i]['areaCode']}>
                ${venueData.areaList[i]['areaName']}
            </option>`;
        areaCodeToName.set(venueData.areaList[i]['areaCode'], venueData.areaList[i]['areaName']);
    }

    areaSelector = areaSelector + `</select></div>`;
    let sideBar =
        `<div class="side-bar-item">
                <button id="seat-btn" type="button" class="side-btn" onclick="fillSeat()">添加座位</button>
            </div>
            <div class="side-bar-item">
                <button type="button" class="side-btn" onclick="deleteSeat()">删除座位</button>
            </div>
            <div class="side-bar-item">
                <button type="button" class="side-btn" onclick="reset()">重置</button>
            </div>`;


    $("#area-script").remove();
    $("#process-tip").text("Step3/4--填充座位信息");
    $("#tip").text("请先选择区域，再添加座位。选择座位后可删除该座位。重置后可重新添加座位。");
    $("#sign-form").empty().append(form);
    $("#side-bar").empty().append(sideBar);
    $("body").append(script);
    $("#graph").before(areaSelector);
    $("#body").append(`<div id="tooltip" style="display: none;"></div>`);

    initCanvas();
    myAreaCode = venueData.areaList[0]['areaCode'];

    layui.use('element', function () {
        let element = layui.element;
        element.progress('sign-up', "75%");
    });
}


function stepFour() {
    // 检查数据
    saveSeat();
    if (venueData.areaList.length !== venueData.seatGraphList.length) {
        alertWindow("请完成所有区域的座位分布图的绘制");
        // console.log(JSON.stringify(venueData));
        return;
    }
    upLoad();
}


function upLoad() {

    for (let i = 0; i < venueData.seatGraphList.length; i++) {
        venueData.seatGraphList[i].areaName = areaCodeToName.get(venueData.seatGraphList[i].areaCode);
    }

    $.post("/api/venues/sign-up", {
        "venueName": venueData.venueName,
        "location": venueData.location,
        "email": venueData.email,
        "password": venueData.password,
        "description": venueData.description,
        "areaGraph": venueData.areaGraph,
        "seatGraphList": JSON.stringify(venueData.seatGraphList),
    }).done(function (data) {
        // console.log(data);
        changeDisplay(data["venueCode"]);
    }).fail(function (xhr) {
        alertWindow(JSON.parse(xhr.responseText));
    });


}

function changeDisplay(venueCode) {
    let form =
        `<div class="layui-form-item">
            <button id="next-step-4" class="layui-btn layui-btn-normal layui-btn-fluid" onclick="{window.location.href='/venue/'}">完成
            </button>
        </div>`;

    $("#sign-form").empty().append(form).parent().before(` <div id='wait-tip'>
            <i class="ok-icon" style="font-size: 50px; color: #52c41a;">&#xe8b6;</i>
            成功提交，请等待审核<br><br>您的场馆编码为：${venueCode}<br><br><br>
            您可以直接登录本网站查看审核是否完成
        </div>`);
    $("#graph").remove();
    $("#process-tip").text("Step4/4--等待信息审核");
    $("#tip-container").remove();
    $("#area-selector-bar").remove();

    layui.use('element', function () {
        let element = layui.element;
        element.progress('sign-up', "100%");
    });
}