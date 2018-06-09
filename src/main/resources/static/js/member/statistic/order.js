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
//    for (let i = 0; i < data.length; i++) {
//        content +=
//            `<div class="order-item">
//                <p class="order-title able">${data[i].activityName}</p>
//                <p class="order-info able">${data[i].venueName}</p>
//                <p class="order-info able">${data[i].placeDateString} 下单</p>
//                <p class="order-info able">${data[i].orderState}</p>
//                <a class="order-detail able" href="/member/order/detail?orderId=${data[i].orderId}">查看详情>></a>
//            </div>`;
//    }
//    for (let i = 5 - data.length; i > 0; i--) {
//        content += `<div class="order-disable"></div>`;
//    }

	var formatData = new Array();
	for (var i=0; i<data.length; i++) {
		formatData.push({
			'id' : `${data[i].orderId}`,
			'aname' : `${data[i].activityName}`,
			'vname' : `${data[i].venueName}`,
			'date' : `${data[i].placeDateString} 下单`,
			'ostate' : `${data[i].orderState}`
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
    		field : 'aname'
    	}, {
    		field : 'vname'
    	}, {
    		field : 'date'
    	}, {
    		field : 'ostate'
    	}, {
    		field : 'detail',
    		formatter : function formatter(value, row, index) {
    			return "<button class='btn default-btn order-detail' href='/member/order/detail?orderId=" + row.id + "'>查看详情</button>";
    		}
    	}],
    	data : formatData,
    });
    $("#tab-content .active");
}