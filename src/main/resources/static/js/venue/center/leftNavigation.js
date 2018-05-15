$(function () {
    let leftNav =
        `<ul>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="venue-info" class="nav-a" href="/venue/info">场馆信息</a>
                    </div>
                </li>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="seat-info" class="nav-a" href="/venue/seat">座位信息</a>
                    </div>
                </li>
            </ul>`;

    let href = this.location.href.split("?")[0];
    $("#left-nav").append(leftNav).find("a").each(function () {
        if (this.href === href) {
            $(this).parent().addClass("active");

        } else {
            $(this).parent().removeClass("active");

        }
    });
});

$(function () {
    $("#venue").parent().addClass("active-navigation");
});