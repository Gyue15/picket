$(function () {
    updateList();
});

function displayList(data) {
//    console.log(1, data);
//    let voucher = "";
//    for (let i = 0; i < data.length; i++) {
//        let nowDate = new Date();
//        let ticketClass = '';
//        if (nowDate.getTime() <= data[i].beginTime + 60 * 60 * 1000) {
//            ticketClass = "ticket-able";
//        } else {
//            ticketClass = "ticket-disable";
//        }
//        let date = new Date(data[i].beginTime);
//        voucher += `<div class="row">
//            <div class="col-md-2">
//            </div>
//            <div class="ticket-item col-md-8 ${ticketClass}">
//                <p class="ticket-title able">${data[i].activityName}</p>
//                <p class="ticket-info able">${data[i].venueName} ${data[i].seat}</p>
//                <p class="ticket-info able">开始时间 ${date.Format("yyyy-MM-dd hh:mm:ss")}</p>
//                <p class="ticket-info able">检票码 ${data[i].ticketCode}</p>
//                <p class="ticket-info able">已检票： ${data[i].checked ? '是' : '否'}</p>
//            </div>
//            <div class="col-md-2">
//            </div>
//        </div>`;
//    }
//    for (let i = pageSize - data.length; i > 0; i--) {
//        voucher += "<div class=\"ticket-item ticket-hidden\"></div>";
//    }
//    $("#t-container").empty().append(voucher);
	var formatData = new Array();
	
	for (var i=0; i<data.length; i++) {
		var nowDate = new Date();
        var isAble;
        if (nowDate.getTime() <= data[i].beginTime + 60 * 60 * 1000) {
        	isAble = true;
        } else {
        	isAble = false;
        }
        var date = new Date(data[i].beginTime);
        formatData.push({
        	'aname' : `${data[i].activityName}`,
        	'position' : `${data[i].venueName} ${data[i].seat}`,
        	'stime' : `${date.Format("yyyy-MM-dd hh:mm:ss")}`,
        	'tcode' : `${data[i].ticketCode}`,
        	'hasChecked' : `${data[i].checked ? '是' : '否'}`,
        	'isAble' : `${isAble ? '否' : '是'}`
        });
	}
    $("#t-container").bootstrapTable({
    	showHeader : true,
    	showFooter : false,
    	pagination : true,
    	pageSize : 4,
    	pageList : [4],
    	buttonsAlign : "right",
    	classes : "table table-no-bordered table-hover",
    	columns : [{
    		field : 'aname',
    		title : '活动'
    	}, {
    		field : 'position',
    		title : '地点'
    	}, {
    		field : 'stime',
    		title : '开始时间'
    	}, {
    		field : 'tcode',
    		title : '检票码'
    	}, {
    		field : 'hasChecked',
    		title : '已检票'
    	}, {
    		field : 'isAble',
    		title : '已过期'
    	}],
    	data : formatData,
    });
}

function updateList() {
    $.get("/api/members/tickets", {
        "email": sessionStorage.getItem("memberEmail")
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