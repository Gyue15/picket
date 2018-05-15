$(function () {
        let page = `<a id="before" class="page-active" onclick="turnPage(-1)">上一页</a>
            <a id="pageNum" class="page-num">1/10</a>
            <a id="after" class="page-active" onclick="turnPage(1)">下一页</a>`;
        $("#page").append(page);
    }
);