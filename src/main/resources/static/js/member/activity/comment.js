let pageSize = 5;

let nowPage = 1;
let maxPage = 1;

$(function () {
    $.get("/api/activities/comment-page-numbers", {
        "activity-id": getUrlParam("activityId"),
        "size": pageSize
    }).done(function (data) {
        maxPage = Math.max(data, 1);
        updateList();
        updatePageNum();
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
});

function displayList(data) {
    if (data.length === 0) {
        $("#no-comment").css("display", "");
        return;
    }

    let comment = '';
    for (let i = 0; i < data.length; i++) {
        comment +=
            `<div class="comment-item">
                <div class="comment-bar">
                    <div class="username">${data[i].username}</div>
                    <div class="comment-date"> ${data[i].dateString} 发表</div>
                </div>
                <div class="comment">
                    ${data[i].comment}
                </div>
                <hr style="width: 100%">
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
        "page": Math.min(nowPage, maxPage),
        "size": pageSize
    }).done(function (data) {
        displayList(data);
    }).fail(function (e) {
        alertWindow(e.responseText);
    });
}

function updatePageNum() {
    $("#pageNum").text(`${nowPage}/${maxPage}`);

    if (nowPage > 1) {
        $("#before").addClass("page-pointer").removeClass("dispointer");
    } else {
        $("#before").addClass("dispointer").removeClass("page-pointer");
    }

    if (nowPage < maxPage) {
        $("#after").addClass("page-pointer").removeClass("dispointer");
    } else {
        $("#after").addClass("dispointer").removeClass("page-pointer");
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
        email: localStorage.getItem("memberEmail"),
        comment: comment
    }).done(function () {
        alertWindowCtrl("发布成功", `/member/activity/detail?activityId=${activityId}`);
    }).fail(function (e) {
        alertWindow(e.responseText);
    })
}