$(function () {
    let leftNav =
        `<ul>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="venue-statistic" class="nav-a" href="/venue/statistic">统计信息</a>
                    </div>
                </li>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="venue-order" class="nav-a" href="/venue/order">订单列表</a>
                    </div>
                </li>
            </ul>`;

    let href = this.location.href.split("?")[0];
    $("#left-nav").append(leftNav).find("a").each(function () {
        console.log(this.href + " " + href);
        if (this.href === href) {
            $(this).parent().addClass("active");

        } else {
            $(this).parent().removeClass("active");

        }
    });
});

$(function () {
    $("#data").parent().addClass("active-navigation");
    if (window.location.href==='http://localhost:8080/venue/orderDetail') {
        $("#venue-order").parent().addClass("active");
    }


});