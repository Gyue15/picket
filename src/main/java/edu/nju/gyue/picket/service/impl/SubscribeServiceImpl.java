package edu.nju.gyue.picket.service.impl;

import edu.nju.gyue.picket.entity.Activity;
import edu.nju.gyue.picket.entity.Notification;
import edu.nju.gyue.picket.entity.Subscribe;
import edu.nju.gyue.picket.repository.ActivityRepository;
import edu.nju.gyue.picket.repository.SeatPriceRepository;
import edu.nju.gyue.picket.repository.SubscribeRepository;
import edu.nju.gyue.picket.service.SubscribeService;
import edu.nju.gyue.picket.service.component.TransferComponent;
import edu.nju.gyue.picket.socket.WebSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SubscribeServiceImpl implements SubscribeService {

    private final SubscribeRepository subscribeRepository;

    private final ActivityRepository activityRepository;

    private final SeatPriceRepository seatPriceRepository;

    private final TransferComponent transferComponent;

    @Autowired
    public SubscribeServiceImpl(SubscribeRepository subscribeRepository, ActivityRepository activityRepository, SeatPriceRepository seatPriceRepository, TransferComponent transferComponent) {
        this.subscribeRepository = subscribeRepository;
        this.activityRepository = activityRepository;
        this.seatPriceRepository = seatPriceRepository;
        this.transferComponent = transferComponent;
    }

    @Override
    public void createSubscribe(String userEmail, int activityId) {
        Activity activity = activityRepository.findOne(Long.valueOf(activityId));
        int unSoldNum = seatPriceRepository.countByActivity_ActivityIdAndSold(Long.valueOf(activityId), false);
        Subscribe subscribe = new Subscribe(userEmail, activityId, activity.getActivityName(), 1);
        if (unSoldNum == 0) {
            subscribe.setIsAvailable(0);
        }
        subscribeRepository.save(subscribe);
        subscribeRepository.flush();
    }

    @Override
    public void cancelSubscribe(String userEmail, int activityId) {
        Subscribe subscribe = subscribeRepository.findByUserEmailAndActivityId(userEmail, activityId);
        if (subscribe != null) {
            subscribeRepository.delete(subscribe);
            subscribeRepository.flush();
        }
    }

    @Override
    public boolean isSubscribe(String userEmail, int activityId) {
        Subscribe subscribe = subscribeRepository.findByUserEmailAndActivityId(userEmail, activityId);
        if (subscribe != null) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void updateSubscribe(int activityId) {
        int unSoldNum = seatPriceRepository.countByActivity_ActivityIdAndSold(Long.valueOf(activityId), false);
        System.out.println(activityId + " + " + unSoldNum);
        if (unSoldNum > 0) {
            List<Subscribe> subscribeList = subscribeRepository.findByActivityId(activityId);

            if ((subscribeList != null) && (subscribeList.size() > 0)) {
                System.out.println(activityId);
                Set<String> userEmailSet = new HashSet<>();
                Map<String, List<Notification>> resultMap = new HashMap<>();

                for (Subscribe subscribe : subscribeList) {
                    subscribe.setIsAvailable(1);
                    userEmailSet.add(subscribe.getUserEmail());
                }

                subscribeRepository.save(subscribeList);

                for (String userEmail : userEmailSet) {
                    resultMap.put(userEmail, getUserNotificationList(userEmail));
                }

                WebSocket.notifyUsers(resultMap);
            }
        }
    }

    @Override
    public List<Notification> getUserNotificationList(String userEmail) {
        List<Subscribe> userSubscribeList = subscribeRepository.findByUserEmailAndIsAvailable(userEmail, 1);
        return transferComponent.toNotificationList(userSubscribeList);
    }

}
