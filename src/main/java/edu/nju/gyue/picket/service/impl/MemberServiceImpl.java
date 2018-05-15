package edu.nju.gyue.picket.service.impl;

import edu.nju.gyue.picket.configuration.param.MemberState;
import edu.nju.gyue.picket.entity.Member;
import edu.nju.gyue.picket.entity.Ticket;
import edu.nju.gyue.picket.entity.Voucher;
import edu.nju.gyue.picket.entity.VoucherType;
import edu.nju.gyue.picket.exception.BadRequestException;
import edu.nju.gyue.picket.exception.ResourceConflictException;
import edu.nju.gyue.picket.model.MemberModel;
import edu.nju.gyue.picket.model.TicketModel;
import edu.nju.gyue.picket.model.VoucherModel;
import edu.nju.gyue.picket.model.VoucherTypeModel;
import edu.nju.gyue.picket.repository.MemberRepository;
import edu.nju.gyue.picket.repository.TicketRepository;
import edu.nju.gyue.picket.repository.VoucherRepository;
import edu.nju.gyue.picket.repository.VoucherTypeRepository;
import edu.nju.gyue.picket.service.MemberService;
import edu.nju.gyue.picket.service.component.TransferComponent;
import edu.nju.gyue.picket.util.DateUtil;
import edu.nju.gyue.picket.util.MailUtil;
import edu.nju.gyue.picket.util.MemberUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    private final TransferComponent transferComponent;

    private final VoucherRepository voucherRepository;

    private final VoucherTypeRepository voucherTypeRepository;

    private final TicketRepository ticketRepository;

    @Autowired
    public MemberServiceImpl(MemberRepository memberRepository, TransferComponent transferComponent,
                             VoucherRepository voucherRepository, VoucherTypeRepository voucherTypeRepository,
                             TicketRepository ticketRepository) {
        this.memberRepository = memberRepository;
        this.transferComponent = transferComponent;
        this.voucherRepository = voucherRepository;
        this.voucherTypeRepository = voucherTypeRepository;
        this.ticketRepository = ticketRepository;
    }

    @Override
    public MemberModel saveMember(MemberModel memberModel) {
        Member member = memberRepository.findOne(memberModel.getEmail());
        if (member == null || member.getEmail() == null) {
            throw new BadRequestException("没有该用户");
        }
        if (member.getValid() == MemberState.ABOLISHED) {
            throw new BadRequestException("该账号已被废弃");
        }
        member = transferComponent.toEntity(memberModel, member);
        member = memberRepository.save(member);
        return transferComponent.toModel(member);
    }

    @Override
    public MemberModel abolishAccount(String email) {
        Member member = verifyMemberEntity(email);
        member.setValid(MemberState.ABOLISHED);
        member = memberRepository.save(member);
        return transferComponent.toModel(member);
    }

    @Override
    public MemberModel getMemberInfo(String email) {
        Member member = verifyMemberEntity(email);
        return transferComponent.toModel(member);
    }

    @Override
    public MemberModel getPureMemberInfo(String email) {
        Member member = memberRepository.findOne(email);
        return transferComponent.toModel(member);
    }

    @Override
    public MemberModel verifyMember(String email, String password) {
        Member member = verifyMemberEntity(email, password);
        return transferComponent.toModel(member);
    }

    @Override
    public MemberModel signUp(String username, String email, String password) throws MessagingException,
            NoSuchAlgorithmException {
        verifyEmail(email);
        Member member = new Member();
        member.setUsername(username);
        member.setEmail(email);
        member.setPassword(password);
        member.setValid(MemberState.NOT_VERIFY);
        member.setLevel(0);
        member.setPoint(0);
        member.setSignDate(new Date());
        // 然后发送邮件
        member = MailUtil.activateMail(member);
        memberRepository.save(member);
        return transferComponent.toModel(member);
    }

    @Override
    public void resendEmail(String email) throws MessagingException, NoSuchAlgorithmException {
        Member member = memberRepository.findOne(email);
        member = MailUtil.activateMail(member);
        memberRepository.saveAndFlush(member);
    }

    @Override
    public MemberModel changePassword(String email, String oldPassword, String newPassword) {
        Member member = verifyMemberEntity(email, oldPassword);
        member.setPassword(newPassword);
        memberRepository.save(member);
        return transferComponent.toModel(member);
    }

    @Override
    public Double getDiscount(String email) {
        Member member = verifyMemberEntity(email);
        return MemberUtil.getMemberDiscount(member.getLevel());
    }

    @Override
    public List<VoucherTypeModel> getVoucherTypes(String email) {
        List<VoucherType> voucherTypeList = voucherTypeRepository.findAll();
        return voucherTypeList.stream().map(item -> {
            VoucherTypeModel voucherTypeModel = new VoucherTypeModel();
            voucherTypeModel.setVoucherTypeId(item.getVoucherTypeId());
            voucherTypeModel.setDescription(item.getDescription() + "，需要积分：" + item.getNeedPoint());
            return voucherTypeModel;
        }).collect(Collectors.toList());
    }

    @Override
    public void changeVoucher(String email, Long voucherTypeId, Integer num) {
        Member member = verifyMemberEntity(email);
        VoucherType voucherType = voucherTypeRepository.findOne(voucherTypeId);
        if (voucherType.getNeedPoint() > member.getPoint()) {
            throw new BadRequestException("没有足够的积分");
        }
        member.setPoint(member.getPoint() - voucherType.getNeedPoint());
        memberRepository.saveAndFlush(member);
        List<Voucher> voucherList = new ArrayList<>();
        for (int i = 0; i < num; i++) {
            Voucher voucher = new Voucher();
            voucher.setUsed(false);
            voucher.setDiscountMoney(voucherType.getDiscountMoney());
            voucher.setLeastDate(DateUtil.getSpecifiedDayAfter(new Date(), 30));
            voucher.setLeastMoney(voucherType.getLeastMoney());
            voucher.setMember(member);
            voucherList.add(voucher);
        }

        voucherRepository.save(voucherList);
    }

    @Override
    public List<VoucherModel> getVoucherList(String email, Integer page, Integer pageSize) {
        Pageable pageable = new PageRequest(page - 1, pageSize, Sort.Direction.ASC, "leastDate");
        Page<Voucher> voucherPage = voucherRepository.findByMember_EmailAndIsUsedAndLeastDateAfter(email, false, new
                Date(), pageable);
        return transferComponent.toVoucherModelList(voucherPage.getContent());
    }

    @Override
    public Integer getVouchersPageNum(String email, Integer pageSize) {
        Integer num = voucherRepository.countByMember_EmailAndIsUsedAndLeastDateAfter(email, false, new Date());
        return (num + pageSize - 1) / pageSize;
    }

    @Override
    public List<TicketModel> getTicketList(String email, Integer page, Integer pageSize) {
        Pageable pageable = new PageRequest(page - 1, pageSize, Sort.Direction.DESC, "ticketId");
        Page<Ticket> ticketPage = ticketRepository.findByMember_EmailAndBeginTimeAfter(email, new Date(), pageable);
        return ticketPage.getContent().stream().map(ticket -> {
            TicketModel ticketModel = new TicketModel();
            ticketModel.setTicketCode(transferComponent.longToString(ticket.getTicketId(), 6));
            ticketModel.setVenueName(ticket.getVenueName());
            ticketModel.setSeat(ticket.getAreaName() + " " + ticket.getSeatRow() + "排" + ticket.getSeatColumn() + "座");
            ticketModel.setBeginTime(ticket.getBeginTime());
            ticketModel.setActivityName(ticket.getActivityName());
            ticketModel.setChecked(ticket.getIsUsed());
            return ticketModel;
        }).collect(Collectors.toList());
    }

    @Override
    public Integer getTicketPageNum(String email, Integer pageSize) {
        Integer num = ticketRepository.countByMember_EmailAndBeginTimeAfter(email, new Date());
        return (num + pageSize - 1) / pageSize;
    }

    private Member verifyMemberEntity(String email, String password) {
        Member member = memberRepository.findByEmailAndPassword(email, password);
        verifyMember(member);
        return member;
    }

    private Member verifyMemberEntity(String email) {
        Member member = memberRepository.findOne(email);
        verifyMember(member);
        return member;
    }

    private void verifyMember(Member member) {
        if (member == null || member.getEmail() == null) {
            throw new BadRequestException("没有该用户");
        }
        if (member.getValid() == MemberState.NOT_VERIFY) {
            throw new BadRequestException("您的邮箱还没有验证");
        }
        if (member.getValid() == MemberState.ABOLISHED) {
            throw new BadRequestException("该账号已被废弃");
        }
    }

    private void verifyEmail(String email) {
        Member member = memberRepository.findOne(email);
        if (member != null && member.getEmail() != null) {
            throw new ResourceConflictException("该邮箱已被占用");
        }
    }
}
