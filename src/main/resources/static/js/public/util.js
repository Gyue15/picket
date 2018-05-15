function getUrlParam(key) {
    let reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    let result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}

function alertWindow(str, title) {
    let myTitle = title || '提示信息';
    layer.msg(str);
    // layer.open({
    //     type: 0,
    //     title: myTitle,
    //     content: str,
    // });
}

function alertWindowCtrl(str, url) {
    layer.open({
        type: 0,
        title: '提示信息',
        content: str,
        yes: function () {
            window.location.href = url;
        },
    });
}

function alertWindowBigger(str) {
    layer.open({
        type: 0,
        area: ['400px', '240px'],
        title: '提示信息',
        content: str,
    });
}
