$(function () {
    let navigation = `<ul>
        <li class="col-md-4" style="padding: 17px;text-align: center">
            <div style="padding: 10px;  display: inline; height: inherit;">
                <a id="check-info" class="navigation-item" href="/manager/addVenue">审核信息</a>
            </div>
        </li>
        <li class="col-md-4" style="padding: 17px; text-align: center">
            <div style="padding: 10px; display: inline;  height: inherit;">
                <a id="pay" class="navigation-item" href="/manager/pay">账务结算</a>
            </div>
        </li>
        <li class="col-md-4" style="padding: 17px; text-align: center">
            <div style="padding: 10px; display: inline; height: inherit;">
                <a id="data"  class="navigation-item" href="/manager/statistic">统计信息</a>
            </div>
        </li>
    </ul>`;
    let href = this.location.href.split("?")[0];
    $("#navigation").append(navigation).find("a").each(function () {
        // console.log(this.href + " " + href);
        if (this.href === href) {
            $(this).parent().addClass("active-navigation");
            this.onclick = function () {
                return false;
            }
        } else {
            $(this).parent().removeClass("active-navigation");
            this.onclick = function () {
                return true;
            }
        }
    });
});