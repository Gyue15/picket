$(function () {
	updateList($("#unchecked-table"), "PAYED_AND_UNCHECK");
	updateList($("#checked-table"), "PAYED_AND_CHECKED");
	updateList($("#unpayed-table"), "UN_PAYED");
	updateList($("#cancled-table"), "CANCLED");
	updateList($("#unsubscribe-table"), "UNSUBSCRIBE");
	updateList($("#offline-table"), "OFF_LINE");
});

function updateList(domElement, state) {
    $("#page").css("display", "");
    $.get("/api/orders", {
        "user-type": "MEMBER",
        "id": sessionStorage.getItem("memberEmail"),
        "order-state": state,
        "page": 0,
        "page-size": 0
    }).done(function (data) {
        displayList(domElement, data);
    }).fail(function (xhr) {
        console.log(xhr.responseText);
    });
}

function displayList(domElement, data) {
	var formatData = new Array();
	for (var i=0; i<data.length; i++) {
		formatData.push({
			'id' : `${data[i].orderId}`,
			'pic': `<img src="/showpic/${data[i].activityId}.jpg" height="80" width="60"/>`,
			'aname' : `${data[i].activityName}`,
			'vname' : `${data[i].venueName}`,
			'date' : `${data[i].placeDateString} 下单`
		});
	}
	$(domElement).bootstrapTable({
    	showHeader : false,
    	showFooter : false,
    	pagination : true,
    	pageSize : 10,
    	pageList : [10],
    	buttonsAlign : "right",
    	classes : "table table-no-bordered table-hover",
    	columns : [{
    		field : 'id',
    		visible : false
    	}, {
			field: 'pic'
		}, {
    		field : 'aname'
    	}, {
    		field : 'vname'
    	}, {
    		field : 'date'
    	}, {
    		field : 'detail',
    		formatter : function formatter(value, row, index) {
    			return "<a class='order-detail' style='padding:10px;' href='/member/order/detail?orderId=" + row.id + "'>查看详情</a>";
    		}
    	}],
    	data : formatData,
    });
    $("#tab-content .active");
}