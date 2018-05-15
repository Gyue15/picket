package edu.nju.gyue.picket.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import edu.nju.gyue.picket.configuration.param.OrderState;
import edu.nju.gyue.picket.configuration.param.OrderType;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class ActivityOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private Double orderValue;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date placeDate;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date beginDate;

    @Enumerated(EnumType.STRING)
    private OrderType orderType;

    @Enumerated(EnumType.STRING)
    private OrderState orderState;

    private Integer seatNum;

    private Double unitPrice;

    private String payAccountId;

    private Boolean isPayed;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "member_email")
    private Member member;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "venue_code")
    private Venue venue;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "activity_id")
    private Activity activity;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "activityOrder")
    private List<SeatPrice> seatPriceList;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "activityOrder")
    private List<Ticket> ticketList;

    public Integer getSeatNum() {
        return seatNum;
    }

    public void setSeatNum(Integer seatNum) {
        this.seatNum = seatNum;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public OrderType getOrderType() {
        return orderType;
    }

    public void setOrderType(OrderType orderType) {
        this.orderType = orderType;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Double getOrderValue() {
        return orderValue;
    }

    public void setOrderValue(Double orderValue) {
        this.orderValue = orderValue;
    }

    public Date getPlaceDate() {
        return placeDate;
    }

    public void setPlaceDate(Date placeDate) {
        this.placeDate = placeDate;
    }

    public OrderState getOrderState() {
        return orderState;
    }

    public void setOrderState(OrderState orderState) {
        this.orderState = orderState;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public Date getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(Date beginDate) {
        this.beginDate = beginDate;
    }

    public String getPayAccountId() {
        return payAccountId;
    }

    public void setPayAccountId(String payAccountId) {
        this.payAccountId = payAccountId;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public Boolean getIsPayed() {
        return isPayed;
    }

    public void setIsPayed(Boolean isPayed) {
        this.isPayed = isPayed;
    }

    public List<SeatPrice> getSeatPriceList() {
        return seatPriceList;
    }

    public void setSeatPriceList(List<SeatPrice> seatPriceList) {
        this.seatPriceList = seatPriceList;
    }

    public List<Ticket> getTicketList() {
        return ticketList;
    }

    public void setTicketList(List<Ticket> ticketList) {
        this.ticketList = ticketList;
    }

    @Override
    public String toString() {
        return "ActivityOrder{" + "orderId=" + orderId + ", orderValue=" + orderValue + ", placeDate=" + placeDate +
                ", beginDate=" + beginDate + ", orderType=" + orderType + ", orderState=" + orderState + ", seatNum="
                + seatNum + ", unitPrice=" + unitPrice + ", payAccountId='" + payAccountId + '\'' + ", isPayed=" +
                isPayed + '}';
    }
}
