// 基于准备好的dom，初始化echarts实例
let myChart = echarts.init(document.getElementById('statistic-chart'), "light");

let incomeX, incomeY = [], orderType, orderMap = [];

$(function () {
    $.get("/api/statistics/venues", {
        "venue-code": sessionStorage.getItem("venueCode")
    }).done(function (data) {
        incomeX = data.incomeX;
        incomeY = data.incomeY.map(function (object) {
            return object.toFixed(2);
        });
        orderType = Object.keys(data.orderMap);
        orderType.map(function (object) {
            let orderMapItem = {};
            // console.log(index, object);
            orderMapItem.value = data.orderMap[object];
            orderMapItem.name = object;
            orderMap.push(orderMapItem);
        });
        $("#bottom-tip").text(`今日收入：${data.todayMoney.toFixed(2)}元，待支付：${data.moneyToPay.toFixed(2)}元`);
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
    $("#income-statistic").trigger("click");
}

function setChart(chartId) {
    if (chartId === "income-statistic") {
        incomeStatisticChart();
    } else if (chartId === "order-statistic") {
        orderStatisticChart();
    }
}

function incomeStatisticChart() {
    $("#temp-tip").remove();
    if (incomeX.length === 0) {
        myChart.setOption({}, true);
        $("#bottom-tip").css("display", "none");
        $("#statistic-chart").css("display", "none");
        let tip = `<blockquote id="temp-tip" class="layui-elem-quote" style="width: 90%;margin: 3% auto">暂时没有可显示的信息哦。</blockquote>`;
        $("#chart-nav").after(tip);
        return;
    }
    $("#bottom-tip").css("display", "");
    $("#statistic-chart").css("display", "");

    let option = {
        xAxis: {
            type: 'category',
            data: incomeX
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
            data: incomeY,
            type: 'line',
            smooth: true
        }]
    };
    // myChart.clear();
    // console.log("2222222222");
    myChart.setOption(option, true);
}

function orderStatisticChart() {
    $("#temp-tip").remove();
    if (orderMap.length === 0) {
        myChart.setOption({}, true);
        $("#bottom-tip").css("display", "none");
        $("#statistic-chart").css("display", "none");
        let tip = `<blockquote id="temp-tip" class="layui-elem-quote" style="width: 90%;margin: 3% auto">暂时没有可显示的信息哦。</blockquote>`;
        $("#chart-nav").after(tip);
        return;
    }
    $("#bottom-tip").css("display", "");
    $("#statistic-chart").css("display", "");
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
                data: orderMap
            }
        ]
    };
    // console.log("3333333333");
    myChart.setOption(option, true);
}