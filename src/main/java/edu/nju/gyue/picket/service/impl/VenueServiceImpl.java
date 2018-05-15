package edu.nju.gyue.picket.service.impl;

import edu.nju.gyue.picket.configuration.param.CheckResult;
import edu.nju.gyue.picket.configuration.param.CheckType;
import edu.nju.gyue.picket.entity.Manager;
import edu.nju.gyue.picket.entity.Venue;
import edu.nju.gyue.picket.entity.VenueCheck;
import edu.nju.gyue.picket.entity.VenueMessage;
import edu.nju.gyue.picket.exception.BadRequestException;
import edu.nju.gyue.picket.exception.ResourceNotFoundException;
import edu.nju.gyue.picket.model.ManagerPayModel;
import edu.nju.gyue.picket.model.VenueMessageModel;
import edu.nju.gyue.picket.model.VenueModel;
import edu.nju.gyue.picket.repository.ManagerRepository;
import edu.nju.gyue.picket.repository.VenueCheckRepository;
import edu.nju.gyue.picket.repository.VenueMessageRepository;
import edu.nju.gyue.picket.repository.VenueRepository;
import edu.nju.gyue.picket.service.component.TransferComponent;
import edu.nju.gyue.picket.util.CodeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class VenueServiceImpl implements edu.nju.gyue.picket.service.VenueService {

    private final VenueRepository venueRepository;

    private final VenueCheckRepository venueCheckRepository;

    private final TransferComponent transferComponent;

    private final VenueMessageRepository venueMessageRepository;

    private final ManagerRepository managerRepository;

    @Autowired
    public VenueServiceImpl(VenueRepository venueRepository, VenueCheckRepository venueCheckRepository,
                            TransferComponent transferComponent, VenueMessageRepository venueMessageRepository,
                            ManagerRepository managerRepository) {
        this.venueRepository = venueRepository;
        this.venueCheckRepository = venueCheckRepository;
        this.transferComponent = transferComponent;
        this.venueMessageRepository = venueMessageRepository;
        this.managerRepository = managerRepository;
    }

    @Override
    public VenueModel login(String venueCode, String password) {
        Venue venue = venueRepository.findByVenueCodeAndPassword(venueCode, password);
        if (venue == null || venue.getVenueCode() == null) {
            throw new BadRequestException("场馆编码或密码错误");
        }
        return transferComponent.toModel(venue);
    }

    @Override
    public VenueModel signUp(String venueName, String location, String email, String password, String description,
                             String areaGraphUrl, String seatGraphUrl) {
        VenueCheck venueCheck = new VenueCheck();
        venueCheck.setAreaGraphUrl(areaGraphUrl);
        venueCheck.setCheckTime(new Date());
        venueCheck.setDetail(description);
        venueCheck.setEmail(email);
        venueCheck.setInCheck(true);
        venueCheck.setLocation(location);
        venueCheck.setPassword(password);
        venueCheck.setSeatGraphUrl(seatGraphUrl);
        venueCheck.setVenueName(venueName);
        venueCheck.setVenueCode(CodeUtil.getUniqueCode());
        venueCheck.setCheckType(CheckType.ADD);

        venueCheck = venueCheckRepository.saveAndFlush(venueCheck);

        return transferComponent.toModel(venueCheck);
    }

    @Override
    public VenueModel getVenue(String venueCode) {
        Venue venue = venueRepository.findOne(venueCode);
        if (venue == null || venue.getVenueCode() == null) {
            System.out.println("getVenue: " + venueCode);
            throw new ResourceNotFoundException("没有找到这个场馆");
        }
        VenueModel venueModel =transferComponent.toModel(venue);
        if (venueCheckRepository.findOne(venueCode).getInCheck()) {
            venueModel.setInCheck(true);
        }
        return venueModel;
    }

    @Override
    public VenueModel getVenueCheck(String venueCode) {
        VenueCheck venueCheck = venueCheckRepository.findOne(venueCode);
        if (venueCheck == null || venueCheck.getVenueCode() == null) {
            throw new ResourceNotFoundException("没有找到修改信息");
        }
        return transferComponent.toModel(venueCheck);
    }

    @Override
    public List<VenueModel> getCheckVenueList(CheckType checkType, Integer page, Integer pageSize) {
        Pageable pageable = new PageRequest(page - 1, pageSize, Sort.Direction.ASC, "checkTime");
        Page<VenueCheck> venueCheckPage = venueCheckRepository.findByInCheckAndCheckType(true, checkType, pageable);
        List<VenueCheck> venueCheckList = venueCheckPage.getContent();
        return transferComponent.toVenueModelList(venueCheckList);
    }

    @Override
    public void modifyVenue(VenueModel venueModel) {
        VenueCheck venueCheck = venueCheckRepository.findOne(venueModel.getVenueCode());
        if (venueCheck == null || venueCheck.getVenueCode() == null) {
            throw new BadRequestException("场馆编号不存在");
        }
        venueCheck = transferComponent.toEntity(venueModel, venueCheck, CheckType.MODIFY);
        venueCheck.setInCheck(true);
        venueCheckRepository.saveAndFlush(venueCheck);
    }

    @Override
    public String getAreaGraphUrl(String venueCode) {
        Venue venue = venueRepository.findOne(venueCode);
        if (venue == null || venue.getVenueCode() == null) {
            VenueCheck venueCheck = venueCheckRepository.findOne(venueCode);
            if (venueCheck == null || venueCheck.getVenueCode() == null) {
                throw new ResourceNotFoundException("没有找到这个场馆");
            }
            return venueCheck.getAreaGraphUrl();
        }
        return venue.getAreaGraphUrl();
    }

    @Override
    public String getSeatGraphUrl(String venueCode) {
        Venue venue = venueRepository.findOne(venueCode);
        if (venue == null || venue.getVenueCode() == null) {
            VenueCheck venueCheck = venueCheckRepository.findOne(venueCode);
            if (venueCheck == null || venueCheck.getVenueCode() == null) {
                throw new ResourceNotFoundException("没有找到这个场馆");
            }
            return venueCheck.getSeatGraphUrl();
        }
        return venue.getSeatGraphUrl();
    }

    @Override
    public Integer getPageNum(CheckType checkType, Integer pageSize) {
        Integer num = venueCheckRepository.countByInCheckAndCheckType(true, checkType);
        return (num + pageSize - 1) / pageSize;
    }

    @Override
    public VenueModel searchVenue(String keyword) {
        Venue venue = venueRepository.findOne(keyword);
        if (venue == null || venue.getVenueCode() == null) {
            throw new ResourceNotFoundException("没有找到这个场馆");
        }
        return transferComponent.toModel(venue);
    }

    @Override
    public void checkResult(CheckResult checkResult, String venueCode, String reason) {
        VenueCheck venueCheck = venueCheckRepository.findOne(venueCode);
        if (venueCheck == null || venueCheck.getVenueCode() == null) {
            throw new ResourceNotFoundException("没有找到这个场馆");
        }
        switch (checkResult) {
            case ALLOW:
                allowCheck(venueCheck);
                break;
            case NOT_ALLOW:
                notAllowCheck(venueCheck, reason);
                break;
            default:
                throw new BadRequestException("审核结果必须是同意或者不同意");
        }
    }

    @Override
    public VenueMessageModel checkMessage(String venueCode) {
        List<VenueMessage> venueMessageList = venueMessageRepository
                .findByVenue_VenueCodeAndNeedDisplayOrderByVenueMessageIdDesc(venueCode, true);
        if (venueMessageList == null || venueMessageList.size() == 0) {
            throw new ResourceNotFoundException("没有需要展示的信息");
        }

        VenueMessage venueMessage = venueMessageList.get(0);
        VenueMessageModel venueMessageModel =transferComponent.toModel(venueMessage);
        venueMessage.setNeedDisplay(false);
        venueMessageRepository.saveAndFlush(venueMessage);

        return venueMessageModel;
    }

    @Override
    public List<ManagerPayModel> getPayList(Integer page, Integer pageSize) {
        Pageable pageable = new PageRequest(page - 1, pageSize, Sort.Direction.ASC ,"unPayDate");
        Page<Venue> venuePage = venueRepository.findByPayMoneyGreaterThan(0.1, pageable);
        return transferComponent.toManagerPayModelList(venuePage.getContent());
    }

    @Override
    public ManagerPayModel getPayModel(String keyword) {
        Venue venue = venueRepository.findOne(keyword);
        if (venue == null || venue.getVenueCode() == null) {
            throw new ResourceNotFoundException("没有找到这个场馆");
        }
        return transferComponent.toPayModel(venue);
    }

    @Override
    public Integer getPayPageNum(Integer pageSize) {
        Integer num = venueRepository.countByPayMoneyGreaterThanOrderByUnPayDateAsc(0.1);
        return (num + pageSize - 1) / pageSize;
    }

    @Override
    public void pay(List<String> venueCodeList) {
        List<Venue> venueList = venueRepository.findByVenueCodeIn(venueCodeList);
        Manager manager = managerRepository.findOne("admin");
        for (Venue venue: venueList) {
            manager.setMoney(manager.getMoney() + venue.getTickSales() - venue.getPayMoney());
            venue.setUnPayDate(null);
            venue.setPayMoney(0.0);
            venue.setTickSales(0.0);
        }
        venueRepository.save(venueList);
        managerRepository.save(manager);

    }

    private void allowCheck(VenueCheck venueCheck) {
        Venue venue;
        if (venueCheck.getCheckType().equals(CheckType.ADD)) {
            venue = checkToVenue(venueCheck);
        } else {
            venue = venueRepository.findOne(venueCheck.getVenueCode());
            venue = checkToVenue(venueCheck, venue);
        }

        venue = venueRepository.saveAndFlush(venue);
        venueCheck.setInCheck(false);
        venueCheckRepository.saveAndFlush(venueCheck);

        // 生成message
        VenueMessage venueMessage = new VenueMessage();
        venueMessage.setVenue(venue);
        venueMessage.setBody("您的审核通已过");
        venueMessage.setTitile("审核通过");
        venueMessage.setNeedDisplay(true);
        venueMessageRepository.saveAndFlush(venueMessage);

    }

    private void notAllowCheck(VenueCheck venueCheck, String reason) {
        if (venueCheck.getCheckType().equals(CheckType.ADD)) {
            venueCheck.setInCheck(false);
            venueCheckRepository.saveAndFlush(venueCheck);
            return;
        }

        Venue venue = venueRepository.findOne(venueCheck.getVenueCode());
        venueCheck = venueToCheck(venueCheck, venue);
        venueCheck.setInCheck(false);
        venueCheckRepository.saveAndFlush(venueCheck);

        // 生成message
        VenueMessage venueMessage = new VenueMessage();
        venueMessage.setVenue(venue);
        venueMessage.setBody("您的审核通没有通过，理由：" + reason);
        venueMessage.setTitile("审核未通过");
        venueMessage.setNeedDisplay(true);
        venueMessageRepository.saveAndFlush(venueMessage);
    }

    private Venue checkToVenue(VenueCheck venueCheck, Venue venue) {
        venue.setInCheck(false);
        venue.setVenueName(venueCheck.getVenueName());
        venue.setLocation(venueCheck.getLocation());
        venue.setEmail(venueCheck.getEmail());
        venue.setDetail(venueCheck.getDetail());
        return venue;
    }

    private Venue checkToVenue(VenueCheck venueCheck) {
        Venue venue = new Venue();
        venue.setInCheck(false);
        venue.setVenueName(venueCheck.getVenueName());
        venue.setVenueCode(venueCheck.getVenueCode());
        venue.setLocation(venueCheck.getLocation());
        venue.setEmail(venueCheck.getEmail());
        venue.setDetail(venueCheck.getDetail());
        venue.setAreaGraphUrl(venueCheck.getAreaGraphUrl());
        venue.setPassword(venueCheck.getPassword());
        venue.setSeatGraphUrl(venueCheck.getSeatGraphUrl());
        venue.setSignDate(new Date());
        venue.setUnPayDate(null);
        venue.setTickSales(0.0);
        venue.setPayMoney(0.0);
        return venue;

    }

    private VenueCheck venueToCheck(VenueCheck venueCheck, Venue venue) {
        venueCheck.setInCheck(false);
        venueCheck.setEmail(venue.getEmail());
        venueCheck.setLocation(venue.getLocation());
        venueCheck.setDetail(venue.getDetail());
        venueCheck.setVenueName(venue.getVenueName());
        return venueCheck;
    }
}
