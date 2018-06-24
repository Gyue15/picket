$(function () {
        let page = `<div id="before" class="page-item" onclick="turnPage(-1)">上一页</div>
            <div id="pageNum" class="page-item page-num">1/10</div>
            <div id="after" class="page-item" onclick="turnPage(1)">下一页</div>`;
        $("#page").append(page);
    }
);