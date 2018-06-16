package edu.nju.gyue.picket.model;

import edu.nju.gyue.picket.configuration.param.MemberState;

public class MemberModel {

    private String username;

    private String email;

    private Integer level;

    private Integer point;

    private MemberState valid;

    private Long validateTime;

    private String token;

    private String mailaddress;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getMailaddress() {
        return mailaddress;
    }

    public void setMailaddress(String mailaddress) {
        this.mailaddress = mailaddress;
    }

    @Override
    public String toString() {
        return "MemberModel{" + "username='" + username + '\'' + ", email='" + email + '\'' + ", level=" + level + "," +
                " point=" + point + ", valid=" + valid + ", validateTime=" + validateTime + ", token='" + token + '\'' + '}';
    }
}
