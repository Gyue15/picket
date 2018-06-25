package edu.nju.gyue.picket.service;

import edu.nju.gyue.picket.entity.Notification;

import java.util.List;

public interface SubscribeService {

    void createSubscribe(String userEmail, int activityId);

    void cancelSubscribe(String userEmail, int activityId);

    boolean isSubscribe(String userEmail, int activityId);

    void updateSubscribe(int activityId);

    List<Notification> getUserNotificationList(String userEmail);
}
