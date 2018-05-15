$(function () {
    let leftNav =
        `<ul>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="new-activity" class="nav-a" href="/venue/activity">未进行活动</a>
                    </div>
                </li>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="old-activity" class="nav-a" href="/venue/oldActivity">已进行活动</a>
                    </div>
                </li>
            </ul>`;

    let href = this.location.href.split("?")[0];
    $("#left-nav").append(leftNav).find("a").each(function () {
        console.log("left： " + this.href + " " + href);
        if (this.href === href || this.href + "/detail" === href) {
            $(this).parent().addClass("active");

        } else {
            $(this).parent().removeClass("active");

        }
    });
});

$(function () {
    $("#activity").parent().addClass("active-navigation");

});