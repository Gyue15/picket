$(function() {
	updateList();
});


function displayList(data) {
	var formatData = new Array();
	for (var i=0; i<data.length; i++) {
		var date = new Date(data[i].leastDate);
		formatData.push({
			'content' : `满${data[i].leastMoney}减${data[i].discountMoney}`,
			'time' : `有效期至：${date.Format("yyyy-MM-dd hh:mm:ss")}`
		});
	}
    $("#v-container").bootstrapTable({
    	showHeader : false,
    	showFooter : false,
    	pagination : true,
    	pageSize : 10,
    	pageList : [10],
    	buttonsAlign : "right",
    	classes : "table table-no-bordered table-hover table-striped",
    	columns : [{
    		field : 'content'	
    	}, {
    		field : 'time',
    		cellStyle : function cellStyle(value, row, index, field) {
    			return {
    				css: {"padding-left":"300px"}
    			};
    		}
    	}],
    	data : formatData,
    });
}

function updateList() {
    $.get("/api/members/vouchers", {
        "email": localStorage.getItem("memberEmail")
    }).done(function (data) {
        console.log(data);
        displayList(data);
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
}

Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};