package edu.nju.gyue.picket.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import edu.nju.gyue.picket.configuration.param.MemberState;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "member")
public class Member {

    @Id
    private String email;

    private String username;

    private String password;

    private Integer level;

    private Integer point;

    @Enumerated(EnumType.STRING)
    private MemberState valid;

    private Long validateTime;

    private String token;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date signDate;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "member")
    private List<Voucher> voucherList;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "member")
    private List<Ticket> ticketList;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "member")
    private List<ActivityOrder> activityOrderList;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getPoint() {
        return point;
    }

    public void setPoint(Integer point) {
        this.point = point;
    }

    public MemberState getValid() {
        return valid;
    }

    public void setValid(MemberState valid) {
        this.valid = valid;
    }

    public Long getValidateTime() {
        return validateTime;
    }

    public void setValidateTime(Long validateTime) {
        this.validateTime = validateTime;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public List<Voucher> getVoucherList() {
        return voucherList;
    }

    public void setVoucherList(List<Voucher> voucherList) {
        this.voucherList = voucherList;
    }

    public List<Ticket> getTicketList() {
        return ticketList;
    }

    public void setTicketList(List<Ticket> ticketList) {
        this.ticketList = ticketList;
    }

    public List<ActivityOrder> getActivityOrderList() {
        return activityOrderList;
    }

    public void setActivityOrderList(List<ActivityOrder> activityOrderList) {
        this.activityOrderList = activityOrderList;
    }

    public Date getSignDate() {
        return signDate;
    }

    public void setSignDate(Date signDate) {
        this.signDate = signDate;
    }
}
