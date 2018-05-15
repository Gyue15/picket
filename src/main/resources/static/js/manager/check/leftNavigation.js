$(function () {
    let leftNav =
        `<ul>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="add-venue" class="nav-a" href="/manager/addVenue">场馆申请</a>
                    </div>
                </li>
                <li class="left-nav-item">
                    <div class="left-nav-inner">
                        <a id="modify-venue" class="nav-a" href="/manager/modifyVenue">场馆修改</a>
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
    $("#check-info").parent().addClass("active-navigation");
});