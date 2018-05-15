let myChart = echarts.init(document.getElementById('statistic-chart'), "light");

let chartX, chartY = [];

$(function () {
    $.get("/api/statistics/managers", {
        "manager-statistic-type": "FINANCE"
    }).done(function (data) {
        chartX = data.chartX;
        chartY = data.chartY.map(function (data) {
            return data.toFixed(2);
        });
        

        console.log(chartX);
        console.log(chartY);
        statisticChart();

    }).fail(function (e) {
        alertWindow(e.responseText);
    });

});


function statisticChart() {
    let option = {
        xAxis: {
            type: 'category',
            data: chartX
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
            data: chartY,
            type: 'line',
            smooth: true
        }]
    };
    // myChart.clear();
    // console.log("2222222222");
    myChart.setOption(option, true);
}