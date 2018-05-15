$(function () {
    let navigation = `<ul>
        <li class="col-md-4" style="padding: 17px;text-align: center">
            <div style="padding: 10px;  display: inline; height: inherit;">
                <a id="activity" class="navigation-item" href="/venue/activity">场馆活动</a>
            </div>
        </li>
        <li class="col-md-4" style="padding: 17px; text-align: center">
            <div style="padding: 10px; display: inline;  height: inherit;">
                <a id="venue" class="navigation-item" href="/venue/info">场馆中心</a>
            </div>
        </li>
        <li class="col-md-4" style="padding: 17px; text-align: center">
            <div style="padding: 10px; display: inline; height: inherit;">
                <a id="data" class="navigation-item" href="/venue/statistic">数据中心</a>
            </div>
        </li>
    </ul>`;
    let href = this.location.href.split("?")[0];
    $("#navigation").append(navigation).find("a").each(function () {
        console.log(this.href + " " + href);
        if (this.href === href) {
            $(this).parent().addClass("active-navigation");

        } else {
            $(this).parent().removeClass("active-navigation");

        }
    });

    if (href === "http://localhost:8080/venue/activity/detail") {
        $("#activity").parent().addClass("active-navigation");
    }
    if (href === "http://localhost:8080/venue/oldActivity/detail") {
        $("#activity").parent().addClass("active-navigation");
    }

});