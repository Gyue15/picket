$(function () {
    let navigation = `<ul>
        <li class="col-md-4" style="padding: 17px;text-align: center">
            <div style="padding: 10px;  display: inline; height: inherit;">
                <a id="activity" class="navigation-item" href="/member/activity">近期活动</a>
            </div>
        </li>
        <li class="col-md-4" style="padding: 17px; text-align: center">
            <div style="padding: 10px; display: inline;  height: inherit;">
                <a id="person" class="navigation-item" href="/member/person">个人中心</a>
            </div>
        </li>
    </ul>`;
    let href = this.location.href.split("?")[0];
    $("#navigation").append(navigation).find("a").each(function () {
        console.log(this.href + " " + href);
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