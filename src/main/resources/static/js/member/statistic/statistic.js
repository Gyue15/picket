// 基于准备好的dom，初始化echarts实例
let myChart = echarts.init(document.getElementById('statistic-chart'), "light");

let consumeType = [], consumeTypeMap = [];

let consumeX = [], consumeY = [];

let orderType = [], orderTypeMap = [];

$(function () {
    $.get("/api/statistics/members", {
        "email": sessionStorage.getItem("memberEmail")
    }).done(function (data) {
        consumeType = Object.keys(data.consumeType);
        consumeType.map(function (item) {
            consumeTypeMap.push({value: data.consumeType[item], name: item});
        });

        consumeX = Object.keys(data.consumeStatistic);
        consumeX.map(function (item) {
            let value = data.consumeStatistic[item];
            consumeY.push(value.toFixed(2) - 0);
        });

        orderType = Object.keys(data.orderStatistic);
        orderType.map(function (item) {
            orderTypeMap.push({value: data.orderStatistic[item], name: item});
        });

        initChart();
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
});

function initChart() {
    $("#chart-nav p").each(function () {
        let id = this.id;
        this.onclick = function () {
            $("#chart-nav p").each(function () {
                if (this.id === id) {
                    $(this).addClass("chart-active");
                } else {
                    $(this).removeClass("chart-active");
                }
            });
            setChart(id);
        };
    });
    $("#consume-type").trigger("click");
}

function setChart(chartId) {
    if (chartId === "consume-type") {
        consumeTypeChart();
    } else if (chartId === "consume-statistic") {
        consumeStatisticChart();
    } else if (chartId === "order-statistic") {
        orderStatisticChart();
    }
}

function consumeTypeChart() {
    // 指定图表的配置项和数据
    let option = {
        tooltip: {
            show: true,
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: consumeType
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: true},
                saveAsImage: {show: true}
            },
            right: '10%'
        },
        calculable: true,
        series: [
            {
                itemStyle: {
                    emphasis: {
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                name: '消费类型',
                type: 'pie',
                radius: '55%',
                data: consumeTypeMap
            }
        ]
    };

// 使用刚指定的配置项和数据显示图表。
//     myChart.clear();
//     console.log("1111111");
    myChart.setOption(option, true);
}

function consumeStatisticChart() {
    let option = {
        xAxis: {
            type: 'category',
            data: consumeX
        },
        yAxis: {
            type: 'value',
            axisLabel:{formatter:'{value} 元'}
        },
        tooltip: {
            show: true,
            formatter: "{b} : {c} (元)"
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: true},
                saveAsImage: {show: true}
            },
            right: '10%'
        },
        series: [{
            data: consumeY,
            type: 'line',
            smooth: true
        }]
    };
    // myChart.clear();
    // console.log("2222222222");
    myChart.setOption(option, true);
}

function orderStatisticChart() {
    let option = {
        tooltip: {
            show: true,
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: true},
                saveAsImage: {show: true}
            },
            right: '10%'
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: orderType
        },
        series: [
            {
                name: '订单统计',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: orderTypeMap
            }
        ]
    };
    // console.log("3333333333");
    myChart.setOption(option, true);
}