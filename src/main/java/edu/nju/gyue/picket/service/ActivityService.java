package edu.nju.gyue.picket.service;

import edu.nju.gyue.picket.model.ActivityModel;
import edu.nju.gyue.picket.model.CommentModel;
import edu.nju.gyue.picket.model.SeatPriceModel;

import java.util.Date;
import java.util.List;

public interface ActivityService {

    Integer getMemberActivityPageNum(String email, Integer pageSize);

    Integer getVenueNewActivityPageNum(String venueCode, Integer pageSize);

    Integer getVenueOldActivityPageNum(String venueCode, Integer pageSize);

    List<ActivityModel> getMemberActivities(Integer pageNum, Integer pageSize);

    List<ActivityModel> getVenueNewActivities(String venueCode, Integer pageNum, Integer pageSize);

    List<ActivityModel> getVenueOldActivities(String venueCode, Integer pageNum, Integer pageSize);

    ActivityModel getActivity(Long activityId);

    Boolean validateTime(Date fromDate, Date toDate, String venueCode);

    Long publishActivity(String activityName, String activityType, Date startTime, Date endTime, String
            description, List<SeatPriceModel> seatPriceModelList, String photoUrl, String venueCode);

    Integer getRemainSeatsNum(Long activityId, Integer areaCode);

    List<CommentModel> getComments(Long activityId, Integer page, Integer size);

    Integer getCommentPageNum(Long activityId, Integer size);

    void postComment(Long activityId, String email, String comment);

    List<ActivityModel> search(String keyword);

    List<ActivityModel> getTypeActivity(String activityType);

    List<ActivityModel> getActivityListForHomepage(String keyWord, int activityNum);
}
