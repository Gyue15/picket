let cities = {
    A: ["阿坝", "阿拉善", "阿里", "安康", "安庆", "鞍山", "安顺", "安阳", "澳门"],
    B: ["北京", "白银", "保定", "宝鸡", "保山", "包头", "巴中", "北海", "蚌埠", "本溪", "毕节", "滨州", "百色", "亳州"],
    C: ["重庆", "成都", "长沙", "长春", "沧州", "常德", "昌都", "长治", "常州", "巢湖", "潮州", "承德", "郴州", "赤峰", "池州", "崇左", "楚雄", "滁州", "朝阳"],
    D: ["大连", "东莞", "大理", "丹东", "大庆", "大同", "大兴安岭", "德宏", "德阳", "德州", "定西", "迪庆", "东营"],
    E: ["鄂尔多斯", "恩施", "鄂州"],
    F: ["福州", "防城港", "佛山", "抚顺", "抚州", "阜新", "阜阳"],
    G: ["广州", "桂林", "贵阳", "甘南", "赣州", "甘孜", "广安", "广元", "贵港", "果洛"],
    H: ["杭州", "哈尔滨", "合肥", "海口", "呼和浩特", "海北", "海东", "海南", "海西", "邯郸", "汉中", "鹤壁", "河池", "鹤岗", "黑河", "衡水", "衡阳", "河源", "贺州", "红河", "淮安", "淮北", "怀化", "淮南", "黄冈", "黄南", "黄山", "黄石", "惠州", "葫芦岛", "呼伦贝尔", "湖州", "菏泽"],
    J: ["济南", "佳木斯", "吉安", "江门", "焦作", "嘉兴", "嘉峪关", "揭阳", "吉林", "金昌", "晋城", "景德镇", "荆门", "荆州", "金华", "济宁", "晋中", "锦州", "九江", "酒泉"],
    K: ["昆明", "开封"],
    L: ["兰州", "拉萨", "来宾", "莱芜", "廊坊", "乐山", "凉山", "连云港", "聊城", "辽阳", "辽源", "丽江", "临沧", "临汾", "临夏", "临沂", "林芝", "丽水", "六安", "六盘水", "柳州", "陇南", "龙岩", "娄底", "漯河", "洛阳", "泸州", "吕梁"],
    M: [, "马鞍山", "茂名", "眉山", "梅州", "绵阳", "牡丹江"],
    N: ["南京", "南昌", "南宁", "宁波", "南充", "南平", "南通", "南阳", "那曲", "内江", "宁德", "怒江"],
    P: ["盘锦", "攀枝花", "平顶山", "平凉", "萍乡", "莆田", "濮阳"],
    Q: ["青岛", "黔东南", "黔南", "黔西南", "庆阳", "清远", "秦皇岛", "钦州", "齐齐哈尔", "泉州", "曲靖", "衢州"],
    R: ["日喀则", "日照"],
    S: ["上海", "深圳", "苏州", "沈阳", "石家庄", "三门峡", "三明", "三亚", "商洛", "商丘", "上饶", "山南", "汕头", "汕尾", "韶关", "绍兴", "邵阳", "十堰", "朔州", "四平", "绥化", "遂宁", "随州", "宿迁", "宿州"],
    T: ["天津", "太原", "泰安", "泰州", "台州", "唐山", "天水", "铁岭", "铜川", "通化", "通辽", "铜陵", "铜仁", "台湾"],
    W: ["武汉", "乌鲁木齐", "无锡", "威海", "潍坊", "文山", "温州", "乌海", "芜湖", "乌兰察布", "武威", "梧州"],
    X: ["厦门", "西安", "西宁", "襄樊", "湘潭", "湘西", "咸宁", "咸阳", "孝感", "邢台", "新乡", "信阳", "新余", "忻州", "西双版纳", "宣城", "许昌", "徐州", "香港", "锡林郭勒", "兴安"],
    Y: ["银川", "雅安", "延安", "延边", "盐城", "阳江", "阳泉", "扬州", "烟台", "宜宾", "宜昌", "宜春", "营口", "益阳", "永州", "岳阳", "榆林", "运城", "云浮", "玉树", "玉溪", "玉林"],
    Z: [ "枣阳市", "枣庄", "增城市", "扎兰屯市", "张家港", "张家界", "张家口", "漳平市", "章丘市", "樟树市", "张掖", "漳州", "湛江", "肇庆", "昭通", "招远市", "浙江", "郑州", "镇江", "枝江市", "中山", "中卫", "钟祥市", "周口", "舟山", "庄河市", "诸城市", "珠海", "诸暨市", "驻马店", "卓尼", "涿州市", "株洲", "淄博", "自贡", "资兴市", "资阳"]
};
let isDown = true;
let cityName = '南京';

function updateCity() {
    let letterList = `<div class="city-row">`;

    let keys = Object.keys(cities);
    console.log(keys);
    for (let i in keys) {
        letterList += `<div class="city-letter" onclick="scrollCity('#letter-${keys[i]}')">${keys[i]}</div>`;
    }
    letterList += "</div>";

    let cityList = `<div id="inner-city-pane">`;
    for (let i in keys) {
        let key = keys[i];
        let objs = cities[key];
        cityList += `<div class="inner-city-row-container"><div id="letter-${key}" class="letter-tip">${key}</div>
        <div class="inner-city-row">`;
        for (let j in objs) {
            cityList += `<div class="city-item" onclick="changeCity('${objs[j]}')">${objs[j]}</div>`;
        }
        cityList += `</div></div>`;
    }
    cityList += `</div>`;

    let cityPane = `
<div id="city-pane" style="display: none">
    <div class="city-row">
        <div class="city-tip">当前城市：</div>
        <div class="city-item" id="now-city">${cityName}</div>
    </div>
    <div class="city-row">
        <div class="city-tip">热门城市：</div>
        <div class="city-item" onclick="changeCity('北京')">北京</div>
        <div class="city-item" onclick="changeCity('上海')">上海</div>
        <div class="city-item" onclick="changeCity('广州')">广州</div>
        <div class="city-item" onclick="changeCity('深圳')">深圳</div>
        <div class="city-item" onclick="changeCity('杭州')">杭州</div>
        <div class="city-item" onclick="changeCity('南京')">南京</div>
    </div>
    <hr style="width: 90%">
    <div class="city-row">
        <div class="city-tip">按字母查找</div>
    </div>
    ${letterList}
    ${cityList}
</div>`;
    $("#site-name-bar").append(cityPane);
    $("#city-pane").css("height", parseInt($("#city-pane").css("height")) + 20);
    $("#city-pane").append("<div style='height:20px;'></div>");
}

function switchCity() {
    if (isDown) {
        $("#down-icon").css("display", "none");
        $("#up-icon").css("display", "");
        $("#city-pane").css("display", "");
    } else {
        $("#down-icon").css("display", "");
        $("#up-icon").css("display", "none");
        $("#city-pane").css("display", "none");
    }
    isDown = !isDown;
}

function changeCity(name) {
    cityName = name;
    $("#city-name").text(cityName);
    $("#now-city").text(cityName);
    switchCity();
}

function scrollCity(id) {
    $("#inner-city-pane").scrollTop($(id).offset().top - $("#letter-A").offset().top);
}