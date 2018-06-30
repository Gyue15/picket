$(function () {
	updateList($("#paid-table"), "PAID_AND_UNMAIL");
	updateList($("#unpaid-table"), "UN_PAID");
	updateList($("#cancelled-table"), "CANCELLED");
});

function updateList(domElement, state) {
	$("#page").css("display", "");
    $.get("/api/orders", {
        "user-type": "MEMBER",
        "id": localStorage.getItem("memberEmail"),
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
		var seatsAndPriceList = new Array();
		for (var j=0; j<`${data[i].seatNameList.length}`; j++) {
			seatsAndPriceList.push(`${data[i].seatNameList[j]}` + "(单价" + `${data[i].seatPriceList[j]}` + ")");
		}
		formatData.push({
			'id' : `${data[i].orderId}`,
			'pic': `<img src="/showpic/${data[i].activityId}.jpg" height="80" width="60"/>`,
			'aname' : `${data[i].activityName}`,
			'vname' : `${data[i].venueName}`,
			'date' : `${data[i].placeDateString}`,
			'seats' : seatsAndPriceList,
			'totalPrice' : `总额￥${data[i].orderValue.toFixed(2)}`,
		});
	}
	$(domElement).bootstrapTable({
    	showHeader : false,
    	showFooter : false,
    	pagination : true,
    	pageSize : 5,
    	pageList : [5],
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
    		field : 'date',
    		visible: false
    	}, {
    		field: 'seats',
    		formatter : function formatter(value, row, index) {
    			var htmlstr = "";
    			if (value.length <=3 ){
    				for (var i=0; i<value.length; i++) {
    					htmlstr += "<div>" + value[i] + "</div>";
    				}
    			} else {
    				for (var i=0; i<value.length; i+=2) {
    					htmlstr += "<div>" + value[i] + "&emsp;" + ((i+1>=value.length)?"":value[i+1]) + "</div>";
    				}
    			}
    			return htmlstr;
    		}
    	}, {
    		field : 'totalPrice'
    	}, {
    		field : 'detail',
    		formatter : function formatter(value, row, index) {
    			return "<a class='order-detail' href='/member/order/detail?orderId=" + row.id + "'>查看详情&gt;&gt;</a>";
    		}
    	}],
    	data : formatData
    });
    $("#tab-content .active");
    $(domElement).find("tbody tr").wrap("<div class='panel panel-default'></div>");
    $(domElement).find("tbody tr").before("<div class='panel-heading'></div>");
    $(domElement).find("tbody .panel .panel-heading").each(function(index, element) {
    	$(element).append("<div class='dateTag'>" + $(domElement).bootstrapTable("getData")[index].date + "</div>");
    	$(element).append("<div class='idTag'>订单号:" + $(domElement).bootstrapTable("getData")[index].id + "</div>");
    });
    
}