package edu.nju.gyue.picket.controller;

import com.alibaba.fastjson.JSON;
import edu.nju.gyue.picket.configuration.param.ActivityType;
import edu.nju.gyue.picket.configuration.param.PayMethod;
import edu.nju.gyue.picket.exception.BadRequestException;
import edu.nju.gyue.picket.model.ActivityModel;
import edu.nju.gyue.picket.model.CommentModel;
import edu.nju.gyue.picket.model.MemberPayModel;
import edu.nju.gyue.picket.model.SeatPriceModel;
import edu.nju.gyue.picket.service.ActivityService;
import edu.nju.gyue.picket.service.PurchaseService;
import edu.nju.gyue.picket.util.FileUtil;
import org.ansj.domain.Term;
import org.ansj.splitWord.analysis.DicAnalysis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/activities", produces = "application/json;charset=UTF-8")
public class ActivityController {

    private final ActivityService activityService;

    @Autowired
    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    /**
     * 获得活动的页码数
     *
     * @param activityType 活动类型（会员可见的活动，场馆可见的未开始活动，场馆可见的已开始活动）
     * @param id           会员邮箱或场馆编号
     * @param pageSize     每页的条目数
     * @return 总页码
     */
    @GetMapping("/page-numbers")
    public Integer getPageNum(@RequestParam("activity") ActivityType activityType, @RequestParam String id,
                              @RequestParam("page-size") Integer pageSize) {
        System.out.println("getPageNum activity: " + activityType + ", id: " + id + ", pageSize" + pageSize);
        switch (activityType) {
            case MEMBER_ACTIVITY:
                return activityService.getMemberActivityPageNum(id, pageSize);
            case VENUE_NEW_ACTIVITY:
                return activityService.getVenueNewActivityPageNum(id, pageSize);
            case VENUE_OLD_ACTIVITY:
                return activityService.getVenueOldActivityPageNum(id, pageSize);
            default:
                throw new BadRequestException("不支持该种活动类型");
        }
    }

    /**
     * 获得活动的list
     *
     * @param activityType 活动类型（会员可见的活动，场馆可见的未开始活动，场馆可见的已开始活动）
     * @param id           会员邮箱或场馆编号
     * @param pageNum      页码
     * @param pageSize     每页的条目数
     * @return 活动的list
     */
    @GetMapping
    public List<ActivityModel> getActivityList(@RequestParam("activity") ActivityType activityType, @RequestParam
            String id, @RequestParam("page") Integer pageNum, @RequestParam("page-size") Integer pageSize) {
        System.out.println("getActivityList activity: " + activityType + ", page: " + pageNum + ", id: " + id + ", "
                + "pageSize: " + pageSize);
        switch (activityType) {
            case MEMBER_ACTIVITY:
                return activityService.getMemberActivities(pageNum, pageSize);
            case VENUE_NEW_ACTIVITY:
                return activityService.getVenueNewActivities(id, pageNum, pageSize);
            case VENUE_OLD_ACTIVITY:
                return activityService.getVenueOldActivities(id, pageNum, pageSize);
            default:
                throw new BadRequestException("不支持该种活动类型");
        }
    }

    /**
     * 获得活动详情
     *
     * @param activityId 活动编号
     * @return 活动详情
     */
    @GetMapping("/{activity-id}")
    public ActivityModel getActivityDetail(@PathVariable("activity-id") Long activityId) {
        return activityService.getActivity(activityId);
    }

    /**
     * 验证发布时间是否合法
     *
     * @param fromDate  发布活动的开始时间
     * @param toDate    发布活动的结束时间
     * @param venueCode 场馆编码
     * @return 是否合法
     */
    @PostMapping("/validate")
    public Boolean validateTime(Date fromDate, Date toDate, String venueCode) {
        System.out.println("fromDate: " + fromDate);
        System.out.println("toDate: " + toDate);
        System.out.println("venueCode: " + venueCode);
        return activityService.validateTime(fromDate, toDate, venueCode);
    }

    /**
     * 发布活动
     *
     * @param activityName  活动名称
     * @param activityType  活动类型
     * @param startTime     开始时间
     * @param endTime       结束时间
     * @param description   活动描述
     * @param seatMapString 座位价格分布表
     * @param photoUrl      活动海报的url
     * @param venueCode     场馆编码
     * @return 活动编号
     */
    @PostMapping("/publish")
    public Long publishActivity(String activityName, String activityType, Date startTime, Date endTime, String
            description, String seatMapString, String photoUrl, String venueCode) {
        // 生成model
        List<SeatPriceModel> seatPriceModelList = JSON.parseArray(seatMapString, SeatPriceModel.class);

        return activityService.publishActivity(activityName, activityType, startTime, endTime, description,
                seatPriceModelList, photoUrl, venueCode);
    }

    /**
     * 上传活动海报
     *
     * @param file 活动海报的图片
     * @return 活动的url
     */
    @PostMapping("/upload")
    public Map<String, String> upLoadPhoto(MultipartFile file) {
        String url = FileUtil.upLoad(file);
        Map<String, String> res = new HashMap<>();
        res.put("url", url);
        return res;
    }

    /**
     * 获得某一活动剩余的座位数量
     *
     * @param activityId 活动编号
     * @return 剩余座位数量
     */
    @GetMapping("/remain-seats")
    public Integer getRemainSeatsNum(@RequestParam("activity-id") Long activityId, @RequestParam("area-code") Integer
            areaCode) {
        return activityService.getRemainSeatsNum(activityId, areaCode);
    }

    @GetMapping("/comments")
    public List<CommentModel> getComments(@RequestParam("activity-id") Long activityId, Integer page, Integer size) {
        return activityService.getComments(activityId, page, size);
    }

    @GetMapping("/comment-page-numbers")
    public Integer getCommentPageNum(@RequestParam("activity-id") Long activityId, Integer size) {
        return activityService.getCommentPageNum(activityId, size);
    }

    @PostMapping("/post-comment")
    public void postComment(Long activityId, String email, String comment) {
        activityService.postComment(activityId, email, comment);
    }

    @GetMapping("/search")
    public List<ActivityModel> search(@RequestParam String keyword) throws UnsupportedEncodingException {
        System.out.println(keyword);
        return activityService.search(keyword);
    }

}
