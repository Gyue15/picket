package edu.nju.gyue.picket.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/")
public class RouteController {

    @RequestMapping
    public String test() {
        return "/member/activity/activity-new";
    }

    @RequestMapping("venue/")
    public String venueIndex() {
        return "/venue/index";
    }

    @RequestMapping("venue/activity")
    public String venueActivity() {
        return "/venue/activity/activity";
    }

    @RequestMapping("venue/oldActivity")
    public String venueActivityOld() {
        return "/venue/activity/activity-old";
    }

    @RequestMapping("venue/activity/detail")
    public String venueActivityDetail() {
        return "/venue/activity/activity-detail";
    }

    @RequestMapping("venue/activity/publish")
    public String venuePublish() {
        return "/venue/activity/publish";
    }

    @RequestMapping("/venue/activity/buy")
    public String venueBuy() {
        return "/venue/activity/buy";
    }

    @RequestMapping("venue/info")
    public String venueInfo() {
        return "/venue/account/info";
    }

    @RequestMapping("venue/seat")
    public String venueSeat() {
        return "/venue/account/seat";
    }

    @RequestMapping("venue/login")
    public String venueLogin() {
        return "/venue/account/login";
    }

    @RequestMapping("venue/signUp")
    public String venueSignUp() {
        return "/venue/account/sign-up";
    }

    @RequestMapping("venue/statistic")
    public String venueStatistic() {
        return "/venue/statistic/statistic";
    }

    @RequestMapping("venue/order")
    public String venueOrder() {
        return "/venue/statistic/order";
    }

    @RequestMapping("venue/orderDetail")
    public String venueOrderDetail() {
        return "/venue/statistic/order-detail";
    }

    @RequestMapping("member/")
    public String memberIndex() {
        return "/member/index";
    }

    @RequestMapping("member/activity")
    public String memberActivity() {
        return "/member/activity/activity";
    }

    @RequestMapping("member/activity/detail")
    public String memberActivityDetail() {
        return "/member/activity/activity-detail";
    }

    @RequestMapping("member/activity/purchase")
    public String memberPurchaseChoose() {
        return "/member/activity/purchase";
    }

    @RequestMapping("member/activity/purchase/pay")
    public String memberPay() {
        return "/member/activity/pay";
    }

    @RequestMapping("member/activity/search")
    public String memberSearch() {
        return "/member/activity/search-activity";
    }

    @RequestMapping("member/person")
    public String memberPerson() {
        return "/member/account/person";
    }

    @RequestMapping("member/person/voucher")
    public String memberVoucher() {
        return "/member/account/voucher";
    }

    @RequestMapping("member/signUp")
    public String memberSignUp() {
        return "/member/account/sign-up";
    }

    @RequestMapping("member/login")
    public String memberLogin() {
        return "/member/account/login";
    }

    @RequestMapping("member/ticket")
    public String memberTicket() {
        return "/member/statistic/ticket";
    }

    @RequestMapping("member/order")
    public String memberOrder() {
        return "/member/statistic/order";
    }

    @RequestMapping("member/order/detail")
    public String memberOrderDetail() {
        return "/member/statistic/order-detail";
    }

    @RequestMapping("member/person/statistic")
    public String memberStatistic() {
        return "/member/statistic/statistic";
    }

    @RequestMapping("manager/")
    public String managerIndex() {
        return "/manager/index";
    }

    @RequestMapping("manager/addVenue")
    public String managerAdd() {
        return "/manager/check/add";
    }

    @RequestMapping("manager/addVenue/detail")
    public String managerAddDetail() {
        return "/manager/check/add-detail";
    }

    @RequestMapping("manager/modifyVenue")
    public String managerModify() {
        return "/manager/check/modify";
    }

    @RequestMapping("manager/modifyVenue/detail")
    public String managerModifyDetail() {
        return "/manager/check/modify-detail";
    }

    @RequestMapping("/manager/pay")
    public String managerPay() {
        return "/manager/pay/pay";
    }

    @RequestMapping("/manager/statistic")
    public String managerStatistic() {
        return "/manager/statistic/statistic";
    }

    @RequestMapping("/manager/venue")
    public String managerVenue() {
        return "/manager/statistic/venue";
    }

    @RequestMapping("/manager/member")
    public String managerMember() {
        return "/manager/statistic/member";
    }

}
