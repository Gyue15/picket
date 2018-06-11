let pageSize = 5;

let nowPage = 1;
let maxPage = 1;

$(function () {
    $.get("/api/activities/comment-page-numbers", {
        "activity-id": getUrlParam("activityId"),
        "size": pageSize
    }).done(function (data) {
        maxPage = data - 0;
    }).done(function () {
        updateList();
        updatePageNum();
    });
});

function displayList(data) {
    if (data.length === 0) {
        $("#comment").empty().append(`<div style="font-size: 16px; margin: 1% auto">暂时没有评论哦</div>`);
        return;
    }

    let comment = '';
    for (let i = 0; i < data.length; i++) {
        comment +=
            `<div class="comment-item">
                <div class="comment-bar">
                    <div class="username">
                       ${data[i].username}
                    </div>
                    <div class="comment-date">
                        ${data[i].dateString} 发表
                    </div>
                </div>
                <div class="comment">
                    ${data[i].comment}
                </div>
                <hr>
            </div>`;
    }
    $("#comment").empty().append(comment);
}

function turnPage(turnNum) {
    turnNum = turnNum - 0;
    if (nowPage + turnNum <= 0 || nowPage + turnNum > maxPage) {
        return;
    }
    nowPage = nowPage + turnNum;
    updateList();
    updatePageNum();
}

function updateList() {
    $.get("/api/activities/comments", {
        "activity-id": getUrlParam("activityId"),
        "page": nowPage,
        "size": pageSize
    }).done(function (data) {
        console.log(data);
        displayList(data);
    }).fail(function (xhr, status) {
        alertWindow(status);
    });
}

function updatePageNum() {
    $("#pageNum").text(`${nowPage}/${maxPage}`);

    if (nowPage > 1) {
        $("#before").addClass("page-active");
        $("#before").removeClass("page-disactive");
    } else {
        $("#before").addClass("page-disactive");
        $("#before").removeClass("page-active");
    }

    if (nowPage < maxPage) {
        $("#after").addClass("page-active");
        $("#after").removeClass("page-disactive");
    } else {
        $("#after").addClass("page-disactive");
        $("#after").removeClass("page-active");
    }

}

function postComment() {
    let comment = $("#comment-post").val();
    if (!comment) {
        alertWindow("请填写评论");
        return;
    }
    $.post("/api/activities/post-comment", {
        activityId: activityId,
        email: sessionStorage.getItem("memberEmail"),
        comment: comment
    }).done(function () {
        alertWindowCtrl("发布成功", `/member/activity/detail?activityId=${activityId}`);
    }).fail(function (e) {
        alertWindow(e.responseText);
    })
}