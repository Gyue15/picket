package edu.nju.gyue.picket.service;

import edu.nju.gyue.picket.model.MemberModel;
import edu.nju.gyue.picket.model.TicketModel;
import edu.nju.gyue.picket.model.VoucherModel;
import edu.nju.gyue.picket.model.VoucherTypeModel;

import javax.mail.MessagingException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

public interface MemberService {

    MemberModel saveMember(MemberModel memberModel);

    MemberModel abolishAccount(String email);

    MemberModel getMemberInfo(String email);

    MemberModel getPureMemberInfo(String email);

    MemberModel verifyMember(String email, String password);

    MemberModel signUp(String username, String email, String password) throws MessagingException,
            NoSuchAlgorithmException;

    void resendEmail(String email) throws MessagingException, NoSuchAlgorithmException;

    MemberModel changePassword(String email, String oldPassword, String newPassword);

    Double getDiscount(String email);

    List<VoucherTypeModel> getVoucherTypes(String email);

    void changeVoucher(String email, Long voucherTypeId, Integer num);

    List<VoucherModel> getVoucherList(String email);

    Integer getVouchersPageNum(String email, Integer pageSize);

    List<TicketModel> getTicketList(String email);

    Integer getTicketPageNum(String email, Integer pageSize);
}
