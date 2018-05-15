$(function () {
    let leftNav =
        `<ul>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="my-ticket" class="nav-a" href="/member/ticket">我的卡包</a>
                    </div>
                </li>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="my-order" class="nav-a" href="/member/order">我的订单</a>
                    </div>
                </li>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="my-statistic" class="nav-a" href="/member/statistic">我的消费</a>
                    </div>
                </li>
            </ul>`;

    let href = this.location.href.split("?")[0];
    $("#left-nav").append(leftNav).find("a").each(function () {
        console.log(this.href + " " + href);
        if (this.href === href) {
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
    console.log($("#data"));
    $("#data").onclick = function () {
        return false;
    }
});