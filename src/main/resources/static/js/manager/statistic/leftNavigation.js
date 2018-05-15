$(function () {
    let leftNav =
        `<ul>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="finance-statistic" class="nav-a" href="/manager/statistic">财务状况</a>
                    </div>
                </li>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="venue-statistic" class="nav-a" href="/manager/venue">场馆统计</a>
                    </div>
                </li>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="member-statistic" class="nav-a" href="/manager/member">会员统计</a>
                    </div>
                </li>
            </ul>`;

    let href = this.location.href.split("?")[0];
    $("#left-nav").append(leftNav).find("a").each(function () {
        console.log("left： " + this.href + " " + href);
        if (this.href === href || this.href + "/detail" === href) {
            $(this).parent().addClass("active");
            this.onclick = function () {
                return false;
            }
        } else {
            $(this).parent().removeClass("active");
            this.onclick = function () {
                return true;
            }
        }
    });
});

$(function () {
    $("#data").parent().addClass("active-navigation");
    $("#data").onclick = function () {
        return false;
    }
});