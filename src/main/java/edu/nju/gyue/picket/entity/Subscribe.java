package edu.nju.gyue.picket.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import edu.nju.gyue.picket.configuration.param.MemberState;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "picket_subscribe")
public class Subscribe {

    @Id
    private int id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "activity_id")
    private int activityId;

    @Column(name = "activity_name")
    private String activityName;

    @Column(name = "is_available")
    private int isAvailable;

    public Subscribe() {
    }

    public Subscribe(String userEmail, int activityId, String activityName, int isAvailable) {
        this.userEmail = userEmail;
        this.activityId = activityId;
        this.activityName = activityName;
        this.isAvailable = isAvailable;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public int getActivityId() {
        return activityId;
    }

    public void setActivityId(int activityId) {
        this.activityId = activityId;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public int getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(int isAvailable) {
        this.isAvailable = isAvailable;
    }
}
