package edu.nju.gyue.picket.service.component;

import edu.nju.gyue.picket.configuration.param.CheckType;
import edu.nju.gyue.picket.configuration.param.OrderState;
import edu.nju.gyue.picket.entity.*;
import edu.nju.gyue.picket.exception.ResourceNotFoundException;
import edu.nju.gyue.picket.model.*;
import edu.nju.gyue.picket.util.DateUtil;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TransferComponent {

    public SeatPrice toEntity(SeatPriceModel seatPriceModel, Activity activity, Venue venue) {
        SeatPrice seatPrice = new SeatPrice();
        seatPrice.setActivity(activity);
        seatPrice.setVenueCode(venue.getVenueCode());
        seatPrice.setSeatId(seatPriceModel.getSeatId());
        seatPrice.setSeatRow(seatPriceModel.getRow());
        seatPrice.setSeatColumn(seatPriceModel.getColumn());
//        seatPrice.setSold(false);
        seatPrice.setSeatPriceId(activity.getActivityId() + "|" + seatPriceModel.getSeatId());
        seatPrice.setAreaName(seatPriceModel.getAreaName());
        seatPrice.setSold(seatPriceModel.getSold());
        seatPrice.setAreaCode(seatPriceModel.getAreaCode());
        seatPrice.setPrice(seatPriceModel.getPrice());
        return seatPrice;
    }

    public Activity toEntity(String activityName, String activityType, Date startTime, Date endTime, String
            description, String photoUrl, Venue venue) {

        Activity activity = new Activity();
        activity.setActivityName(activityName);
        activity.setActivityType(activityType);
        activity.setBeginDate(startTime);
        activity.setEndDate(endTime);
        activity.setDescription(description);
        activity.setPhotoUrl(photoUrl);
        activity.setVenue(venue);
        return activity;
    }

    public VenueCheck toEntity(VenueModel venueModel, VenueCheck venueCheck, CheckType checkType) {
        if (venueModel.getVenueName() != null) {
            venueCheck.setVenueName(venueModel.getVenueName());
        }
        if (venueModel.getDetail() != null) {
            venueCheck.setDetail(venueModel.getDetail());
        }
        if (venueModel.getEmail() != null) {
            venueCheck.setEmail(venueModel.getEmail());
        }
        if (venueModel.getLocation() != null) {
            venueCheck.setLocation(venueModel.getLocation());
        }
        venueCheck.setCheckTime(new Date());
        venueCheck.setCheckType(checkType);
        return venueCheck;
    }

    public Member toEntity(MemberModel memberModel, Member member) {
        if (memberModel.getValid() != null) {
            member.setValid(memberModel.getValid());
        }
        if (memberModel.getLevel() != null) {
            member.setLevel(memberModel.getLevel());
        }
        if (memberModel.getPoint() != null) {
            member.setPoint(memberModel.getPoint());
        }
        if (memberModel.getToken() != null) {
            member.setToken(memberModel.getToken());
        }
        if (memberModel.getUsername() != null) {
            member.setUsername(memberModel.getUsername());
        }
        if (memberModel.getValidateTime() != null) {
            member.setValidateTime(memberModel.getValidateTime());
        }
        return member;
    }

    public MemberModel toModel(Member member) {
        MemberModel memberModel = new MemberModel();
        if (member == null) {
            throw new ResourceNotFoundException("没有此用户");
        }
        memberModel.setLevel(member.getLevel());
        memberModel.setToken(member.getToken());
        memberModel.setUsername(member.getUsername());
        memberModel.setValidateTime(member.getValidateTime());
        memberModel.setValid(member.getValid());
        memberModel.setEmail(member.getEmail());
        memberModel.setPoint(member.getPoint());
        return memberModel;
    }

    private SeatPriceModel toModel(SeatPrice seatPrice) {
        SeatPriceModel seatPriceModel = new SeatPriceModel();
        seatPriceModel.setSold(seatPrice.getSold());
        seatPriceModel.setAreaCode(seatPrice.getAreaCode());
        seatPriceModel.setColumn(seatPrice.getSeatColumn());
        seatPriceModel.setPrice(seatPrice.getPrice());
        seatPriceModel.setVenueCode(seatPrice.getVenueCode());
        seatPriceModel.setSeatId(seatPrice.getSeatId() + "|" + seatPrice.getAreaName());
        seatPriceModel.setAreaName(seatPrice.getAreaName());
        return seatPriceModel;
    }

    public ActivityModel toModel(Activity activity) {
        ActivityModel activityModel = new ActivityModel();
        activityModel.setVenueCode(activity.getVenue().getVenueCode());
        activityModel.setActivityId(activity.getActivityId());
        activityModel.setActivityType(activity.getActivityType());
        activityModel.setDateString(DateUtil.formatDate(activity.getBeginDate()));
        activityModel.setDescription(activity.getDescription());
        activityModel.setName(activity.getActivityName());
        activityModel.setPhoto(activity.getPhotoUrl());
        activityModel.setVenueName(activity.getVenue().getVenueName());
        activityModel.setLocation(activity.getVenue().getLocation());
        activityModel.setEmail(activity.getVenue().getEmail());
        return activityModel;
    }

    private VoucherModel toModel(Voucher voucher) {
        VoucherModel voucherModel = new VoucherModel();
        voucherModel.setDiscountMoney(voucher.getDiscountMoney());
        voucherModel.setVoucherId(voucher.getVoucherId());
        voucherModel.setLeastDate(voucher.getLeastDate());
        voucherModel.setLeastMoney(voucher.getLeastMoney());
        return voucherModel;
    }

    public VenueModel toModel(Venue venue) {
        VenueModel venueModel = new VenueModel();
        venueModel.setVenueName(venue.getVenueName());
        venueModel.setVenueCode(venue.getVenueCode());
        venueModel.setLocation(venue.getLocation());
        venueModel.setDetail(venue.getDetail());
        venueModel.setInCheck(venue.getInCheck());
        venueModel.setEmail(venue.getEmail());
        return venueModel;
    }

    public VenueModel toModel(VenueCheck venueCheck) {
        VenueModel venueModel = new VenueModel();
        venueModel.setEmail(venueCheck.getEmail());
        venueModel.setInCheck(venueCheck.getInCheck());
        venueModel.setDetail(venueCheck.getDetail());
        venueModel.setLocation(venueCheck.getLocation());
        venueModel.setVenueName(venueCheck.getVenueName());
        venueModel.setVenueCode(venueCheck.getVenueCode());
        venueModel.setCheckTimeString(DateUtil.formatDate(venueCheck.getCheckTime()));
        return venueModel;
    }

    public VenueMessageModel toModel(VenueMessage venueMessage) {
        VenueMessageModel venueMessageModel = new VenueMessageModel();
        venueMessageModel.setNeedDisplay(venueMessage.getNeedDisplay());
        venueMessageModel.setTitleString(venueMessage.getTitile());
        venueMessage.setBody(venueMessage.getBody());
        return venueMessageModel;
    }

    public ManagerPayModel toPayModel(Venue venue) {
        ManagerPayModel managerPayModel = new ManagerPayModel();
        managerPayModel.setPayMoney(venue.getPayMoney());
        managerPayModel.setTickSales(venue.getTickSales());
        managerPayModel.setUnPayDateString(DateUtil.formatDate(venue.getUnPayDate()));
        managerPayModel.setVenueCode(venue.getVenueCode());
        managerPayModel.setVenueName(venue.getVenueName());
        return managerPayModel;
    }

    public OrderModel toModel(ActivityOrder activityOrder) {
        OrderModel orderModel = new OrderModel();
        orderModel.setActivityName(activityOrder.getActivity().getActivityName());
        orderModel.setBeginDateString(DateUtil.formatDate(activityOrder.getBeginDate()));
        orderModel.setCanCancel(activityOrder.getBeginDate().getTime() > DateUtil.getSpecifiedDayAfter(new Date(), 3).getTime
                () && activityOrder.getOrderState().equals(OrderState.PAYED_AND_UNCHECK));
        orderModel.setOrderId(longToString(activityOrder.getOrderId(), 7));
        orderModel.setOrderValue(activityOrder.getOrderValue());
        orderModel.setOrderState(activityOrder.getOrderState().getString());
        orderModel.setPlaceDateString(DateUtil.formatDate(activityOrder.getPlaceDate()));
        orderModel.setSeats(activityOrder.getSeatNum());
        orderModel.setVenueName(activityOrder.getVenue().getVenueName());
        orderModel.setOrignState(activityOrder.getOrderState());
        orderModel.setLock(activityOrder.getUnitPrice() != null);
        return orderModel;
    }

    public List<OrderModel> toOrderModelList(List<ActivityOrder> activityOrderList) {
        return activityOrderList.stream().map(this::toModel).collect(Collectors.toList());
    }

    public List<ManagerPayModel> toManagerPayModelList(List<Venue> venueList) {
        return venueList.stream().map(this::toPayModel).collect(Collectors.toList());
    }

    public List<VenueModel> toVenueModelList(List<VenueCheck> venueCheckList) {
        return venueCheckList.stream().map(this::toModel).collect(Collectors.toList());
    }

    public List<VoucherModel> toVoucherModelList(List<Voucher> voucherList) {
        return voucherList.stream().map(this::toModel).collect(Collectors.toList());
    }

    public List<SeatPriceModel> toSeatPriceModelList(List<SeatPrice> seatPriceList) {
        return seatPriceList.stream().map(this::toModel).collect(Collectors.toList());
    }

    public List<ActivityModel> toActivityModelList(List<Activity> activityList) {
        return activityList.stream().map(this::toModel).collect(Collectors.toList());
    }

    public String longToString(Long number, int size) {
        String res = number.toString();
        for (int i = res.length(); i < size; i++) {
            res = "0" + res;
        }
        return res;
    }
}
