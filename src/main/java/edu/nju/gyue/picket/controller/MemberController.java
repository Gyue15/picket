package edu.nju.gyue.picket.controller;

import edu.nju.gyue.picket.configuration.param.MemberState;
import edu.nju.gyue.picket.model.MemberModel;
import edu.nju.gyue.picket.model.TicketModel;
import edu.nju.gyue.picket.model.VoucherModel;
import edu.nju.gyue.picket.model.VoucherTypeModel;
import edu.nju.gyue.picket.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(value = "/api/members", produces = "application/json;charset=UTF-8")
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/sign-up")
    public MemberModel signUp(String username, String email, String password) throws MessagingException,
            NoSuchAlgorithmException {
        return memberService.signUp(username, email, password);
    }

    @PostMapping("/login")
    public MemberModel login(String email, String password) throws NoSuchAlgorithmException {
        System.out.println("login: " + email + ", password" + password);
        return memberService.verifyMember(email, password);
    }

    @PostMapping("/abolish")
    public MemberModel abolishAccount(String email) {
        return memberService.abolishAccount(email);
    }

    @GetMapping
    public MemberModel getInfo(@RequestParam String email) {
        return memberService.getMemberInfo(email);
    }

    @PostMapping(value = "/modify")
    public MemberModel modifyInfo(MemberModel memberModel) {
        return memberService.saveMember(memberModel);
    }

    @GetMapping("/validate-email")
    public String validateEmail(@RequestParam String email, @RequestParam String token) throws MessagingException,
            NoSuchAlgorithmException {
        Long time = System.currentTimeMillis();
        MemberModel memberModel = memberService.getPureMemberInfo(email);
        if (memberModel.getValid() != MemberState.NOT_VERIFY) {
            return "账户已经激活过或已注销";
        }
        if (memberModel.getValidateTime() < time) {
            memberService.resendEmail(email);
            return "错过激活时间，现在将发送一封新的邮件";
        }
        if (!memberModel.getToken().equals(token)) {
            return "token有误";
        }
        memberModel.setValid(MemberState.VERIFY);
        memberService.saveMember(memberModel);
        return "激活成功！";
    }

    @PostMapping("/change-password")
    public MemberModel changePassword(String email, String oldPassword, String newPassword) {
        return memberService.changePassword(email, oldPassword, newPassword);
    }

    @GetMapping("/discounts")
    public Double getDiscount(@RequestParam String email) {
        return memberService.getDiscount(email);
    }

    @GetMapping("/voucher-types")
    public List<VoucherTypeModel> getVoucherTypes(@RequestParam String email) {
//        System.out.println(memberService.getVoucherTypes(email));
        return memberService.getVoucherTypes(email);

    }

    @PostMapping("/change-vouchers")
    public void changeVoucher(String email, Long voucherTypeId, Integer num) {
        System.out.println("changeVoucher: email: " + email + ", voucherTypeId: " + voucherTypeId + ", num: " + num);
        memberService.changeVoucher(email, voucherTypeId, num);
    }

    @GetMapping("/vouchers")
    public List<VoucherModel> getVoucherList(@RequestParam String email) {
        return memberService.getVoucherList(email);
    }

    @GetMapping("/tickets")
    public List<TicketModel> getTicketList(@RequestParam String email, @RequestParam Integer page, @RequestParam
            ("page-size") Integer pageSize) {
        return memberService.getTicketList(email, page, pageSize);
    }

    @GetMapping("/tickets-page-numbers")
    public Integer getTicketPageNum(@RequestParam String email, @RequestParam("page-size") Integer pageSize) {
        return memberService.getTicketPageNum(email, pageSize);
    }
}
