$(function () {
  let leftNav =
      `<ul>
        <li class="left-nav-item">
              <div class="left-nav-inner">
                  <a id="my-order" class="nav-a" href="/member/order">已完成订单</a>
              </div>
          </li>
          <li class="left-nav-item">
              <div class="left-nav-inner">
                  <a id="my-ticket" class="nav-a" href="/member/unpaid">未支付订单</a>
              </div>
          </li>
          <li class="left-nav-item">
              <div class="left-nav-inner">
                  <a id="my-ticket" class="nav-a" href="/member/cancelled">已取消订单</a>
              </div>
          </li>
          <li class="left-nav-item">
              <div class="left-nav-inner">
                  <a id="my-ticket" class="nav-a" href="/member/offline">线下订单</a>
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