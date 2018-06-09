// 基于准备好的dom，初始化echarts实例
//let myChart = echarts.init(document.getElementById('statistic-chart'), "light");
let chart1 = echarts.init(document.getElementById('consume-type-chart'),
		"light");
let chart2 = undefined;
let chart3 = undefined;

let consumeType = [], consumeTypeMap = [];

let consumeX = [], consumeY = [];

let orderType = [], orderTypeMap = [];

$(function() {
	$.get("/api/statistics/members", {
		"email" : sessionStorage.getItem("memberEmail")
	}).done(function(data) {
		consumeType = Object.keys(data.consumeType);
		consumeType.map(function(item) {
			consumeTypeMap.push({
				value : data.consumeType[item],
				name : item
			});
		});

		consumeX = Object.keys(data.consumeStatistic);
		consumeX.map(function(item) {
			let value = data.consumeStatistic[item];
			consumeY.push(value.toFixed(2) - 0);
		});

		orderType = Object.keys(data.orderStatistic);
		orderType.map(function(item) {
			orderTypeMap.push({
				value : data.orderStatistic[item],
				name : item
			});
		});

		chart1.setOption(getChartOption("consume-type"), true);
		initChart();
	}).fail(function(e) {
		alertWindow(e.responseText);
	});
});

function initChart() {
	// $("#chart-nav p").each(function () {
	// let id = this.id;
	// this.onclick = function () {
	// $("#chart-nav p").each(function () {
	// if (this.id === id) {
	// $(this).addClass("chart-active");
	// } else {
	// $(this).removeClass("chart-active");
	// }
	// });
	// setChart(id);
	// };
	// });
	// $("#consume-type").trigger("click");
	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
		if ($(chart1).attr("_dom") == undefined) {
			chart1 = echarts.init(document.getElementById('consume-type-chart'), 'light');
			chart1.setOption(getChartOption("consume-type"), true);
		} else if ($(chart2).attr("_dom") == undefined) {
			chart2 = echarts.init(document.getElementById('consume-statistic-chart'), 'light');
			chart2.setOption(getChartOption("consume-statistic"), true);
		} else if ($(chart3).attr("_dom") == undefined){
			chart3 = echarts.init(document.getElementById('order-statistic-chart'), 'light');
			chart3.setOption(getChartOption("order-statistic"), true);
		}
		
//		if ($("#" + $(e.target).attr("aria-controls")).children()[0].id == chart1._dom.id) {
//			// 
//		} else if ($("#" + $(e.target).attr("aria-controls")).children()[0].id == chart2._dom.id) {
//			if (chart2 == undefined) {
//				chart2 = echarts.init(document.getElementById('consume-statistic-chart'), 'light');
//			}
//			chart2.setOption(getChartOption("consume-statistic"), true);
//		} else {
//			if (chart3 == undefined) {
//				chart3 = echarts.init(document.getElementById('order-statistic-chart'), 'light');
//			}
//			chart3.setOption(getChartOption("order-statistic"), true);
//		}
	})
}

function getChartOption(chartId) {
	if (chartId === "consume-type") {
		return consumeTypeChart();
	} else if (chartId === "consume-statistic") {
		return consumeStatisticChart();
	} else if (chartId === "order-statistic") {
		return orderStatisticChart();
	}
	return undefined;
}

function consumeTypeChart() {
	// 指定图表的配置项和数据
	let option = {
		tooltip : {
			show : true,
			formatter : "{a} <br/>{b} : {c} ({d}%)"
		},
		legend : {
			orient : 'vertical',
			x : 'left',
			data : consumeType
		},
		toolbox : {
			show : true,
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : true
				},
				saveAsImage : {
					show : true
				}
			},
			right : '10%'
		},
		calculable : true,
		series : [ {
			itemStyle : {
				emphasis : {
					shadowBlur : 200,
					shadowColor : 'rgba(0, 0, 0, 0.5)'
				}
			},
			name : '消费类型',
			type : 'pie',
			radius : '55%',
			data : consumeTypeMap
		} ]
	};

	return option;
	// 使用刚指定的配置项和数据显示图表。
	// myChart.clear();
	// console.log("1111111");
	// myChart.setOption(option, true);
}

function consumeStatisticChart() {
	let option = {
		xAxis : {
			type : 'category',
			data : consumeX
		},
		yAxis : {
			type : 'value',
			axisLabel : {
				formatter : '{value} 元'
			}
		},
		tooltip : {
			show : true,
			formatter : "{b} : {c} (元)"
		},
		toolbox : {
			show : true,
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : true
				},
				saveAsImage : {
					show : true
				}
			},
			right : '10%'
		},
		series : [ {
			data : consumeY,
			type : 'line',
			smooth : true
		} ]
	};
	return option;
	// myChart.clear();
	// console.log("2222222222");
	// myChart.setOption(option, true);
}

function orderStatisticChart() {
	let option = {
		tooltip : {
			show : true,
			formatter : "{a} <br/>{b} : {c} ({d}%)"
		},
		toolbox : {
			show : true,
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : true
				},
				saveAsImage : {
					show : true
				}
			},
			right : '10%'
		},
		legend : {
			orient : 'vertical',
			x : 'left',
			data : orderType
		},
		series : [ {
			name : '订单统计',
			type : 'pie',
			radius : [ '50%', '70%' ],
			avoidLabelOverlap : false,
			label : {
				normal : {
					show : false,
					position : 'center'
				},
				emphasis : {
					show : true,
					textStyle : {
						fontSize : '30',
						fontWeight : 'bold'
					}
				}
			},
			labelLine : {
				normal : {
					show : false
				}
			},
			data : orderTypeMap
		} ]
	};
	return option;
	// console.log("3333333333");
	// myChart.setOption(option, true);
}