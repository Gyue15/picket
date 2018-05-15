package edu.nju.gyue.picket.service.impl;

import edu.nju.gyue.picket.configuration.param.Param;
import edu.nju.gyue.picket.entity.Activity;
import edu.nju.gyue.picket.entity.Comment;
import edu.nju.gyue.picket.entity.SeatPrice;
import edu.nju.gyue.picket.entity.Venue;
import edu.nju.gyue.picket.exception.BadRequestException;
import edu.nju.gyue.picket.exception.ResourceNotFoundException;
import edu.nju.gyue.picket.model.ActivityModel;
import edu.nju.gyue.picket.model.CommentModel;
import edu.nju.gyue.picket.model.MemberModel;
import edu.nju.gyue.picket.model.SeatPriceModel;
import edu.nju.gyue.picket.repository.ActivityRepository;
import edu.nju.gyue.picket.repository.CommentRepository;
import edu.nju.gyue.picket.repository.SeatPriceRepository;
import edu.nju.gyue.picket.repository.VenueRepository;
import edu.nju.gyue.picket.service.ActivityService;
import edu.nju.gyue.picket.service.MemberService;
import edu.nju.gyue.picket.service.component.TransferComponent;
import edu.nju.gyue.picket.util.DateUtil;
import org.ansj.domain.Term;
import org.ansj.splitWord.analysis.DicAnalysis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;

    private final SeatPriceRepository seatPriceRepository;

    private final VenueRepository venueRepository;

    private final CommentRepository commentRepository;

    private final MemberService memberService;

    private final TransferComponent transferComponent;

    @Autowired
    public ActivityServiceImpl(ActivityRepository activityRepository, SeatPriceRepository seatPriceRepository,
                               VenueRepository venueRepository, CommentRepository commentRepository, MemberService
                                           memberService, TransferComponent transferComponent) {
        this.activityRepository = activityRepository;
        this.seatPriceRepository = seatPriceRepository;
        this.venueRepository = venueRepository;
        this.commentRepository = commentRepository;
        this.memberService = memberService;
        this.transferComponent = transferComponent;
    }

    @Override
    public Integer getMemberActivityPageNum(String email, Integer pageSize) {
        Date allowDate = DateUtil.getSpecifiedDayAfter(new Date(), 14);
        Integer activityNum = activityRepository.countByBeginDateAfter(allowDate);
        return (activityNum + pageSize - 1) / pageSize;
    }

    @Override
    public Integer getVenueNewActivityPageNum(String venueCode, Integer pageSize) {
        Integer activityNum = activityRepository.countByBeginDateAfterAndVenue_VenueCode(new Date(), venueCode);
        return (activityNum + pageSize - 1) / pageSize;
    }

    @Override
    public Integer getVenueOldActivityPageNum(String venueCode, Integer pageSize) {
        Integer activityNum = activityRepository.countByBeginDateBeforeAndVenue_VenueCode(new Date(), venueCode);
        return (activityNum + pageSize - 1) / pageSize;
    }

    @Override
    public List<ActivityModel> getMemberActivities(Integer pageNum, Integer pageSize) {
        Date allowDate = DateUtil.getSpecifiedDayAfter(new Date(), 14);
        Pageable pageable = new PageRequest(pageNum - 1, pageSize, Sort.Direction.DESC, "beginDate");
        Page<Activity> activityPage = activityRepository.findByBeginDateAfter(allowDate, pageable);
        return transferComponent.toActivityModelList(activityPage.getContent());
    }

    @Override
    public List<ActivityModel> getVenueNewActivities(String venueCode, Integer pageNum, Integer pageSize) {
        Pageable pageable = new PageRequest(pageNum - 1, pageSize, Sort.Direction.DESC, "beginDate");
        Page<Activity> activityPage = activityRepository.findByBeginDateAfterAndVenue_VenueCode(new Date(),
                venueCode, pageable);
        return transferComponent.toActivityModelList(activityPage.getContent());
    }

    @Override
    public List<ActivityModel> getVenueOldActivities(String venueCode, Integer pageNum, Integer pageSize) {
        Pageable pageable = new PageRequest(pageNum - 1, pageSize, Sort.Direction.DESC, "beginDate");
        Page<Activity> activityPage = activityRepository.findByBeginDateBeforeAndVenue_VenueCode(new Date(),
                venueCode, pageable);
        return transferComponent.toActivityModelList(activityPage.getContent());
    }

    @Override
    public ActivityModel getActivity(Long activityId) {
        Activity activity = activityRepository.findOne(activityId);
        return setSeatsMap(transferComponent.toModel(activity));
    }

    @Override
    public Boolean validateTime(Date fromDate, Date toDate, String venueCode) {
        List<Activity> activityList = activityRepository
                .findByBeginDateLessThanEqualAndEndDateGreaterThanEqualAndVenue_VenueCode(fromDate, fromDate,
                        venueCode);
        activityList.addAll(activityRepository
                .findByBeginDateGreaterThanEqualAndBeginDateLessThanEqualAndVenue_VenueCode(fromDate, toDate,
                        venueCode));
//        System.out.println(activityList);
        return activityList.size() == 0;
    }

    @Override
    @Transactional
    public Long publishActivity(String activityName, String activityType, Date startTime, Date endTime, String
            description, List<SeatPriceModel> seatPriceModelList, String photoUrl, String venueCode) {

        // 验证场馆是否合法
        Venue venue = venueRepository.findOne(venueCode);
        if (venue == null || venue.getVenueCode() == null) {
            throw new ResourceNotFoundException("场馆编码有误");
        }

        // 先保存activity
        Activity activity = transferComponent.toEntity(activityName, activityType, startTime, endTime, description,
                photoUrl, venue);
        activity = activityRepository.saveAndFlush(activity);

        // 再保存seatPrice
        List<SeatPrice> seatPriceList = new ArrayList<>();
        for (SeatPriceModel seatPriceModel : seatPriceModelList) {
            seatPriceList.add(transferComponent.toEntity(seatPriceModel, activity, venue));
        }
        seatPriceRepository.save(seatPriceList);

        return activity.getActivityId();
    }


    @Override
    public Integer getRemainSeatsNum(Long activityId, Integer areaCode) {
        return seatPriceRepository.countByActivity_ActivityIdAndAreaCodeAndSold(activityId, areaCode, false);
    }

    @Override
    public List<CommentModel> getComments(Long activityId, Integer page, Integer size) {
        Pageable pageable = new PageRequest(page - 1, size, Sort.Direction.DESC, "commentDate");
        Page<Comment> commentPage = commentRepository.findByActivity_ActivityId(activityId, pageable);
        return commentPage.getContent().stream().map(comment -> {
            CommentModel commentModel = new CommentModel();
            commentModel.setComment(comment.getComment());
            commentModel.setUsername(comment.getUsername());
            commentModel.setDateString(DateUtil.formatDate(comment.getCommentDate()));
            return commentModel;
        }).collect(Collectors.toList());
    }

    @Override
    public Integer getCommentPageNum(Long activityId, Integer size) {
        Integer num = commentRepository.countByActivity_ActivityId(activityId);
        return (num + size - 1) / size;
    }


    @Override
    public void postComment(Long activityId, String email, String comment) {
        Activity activity = activityRepository.findOne(activityId);
        if (activity == null) {
            throw new BadRequestException("该活动不存在");
        }
        MemberModel memberModel = memberService.getMemberInfo(email);

        Comment commentEntity = new Comment();
        commentEntity.setActivity(activity);
        commentEntity.setComment(comment);
        commentEntity.setCommentDate(new Date());
        commentEntity.setUsername(memberModel.getUsername());

        commentRepository.save(commentEntity);

    }

    @Override
    public List<ActivityModel> search(String keyword) {
        List<Term> termList = DicAnalysis.parse(keyword).getTerms();
        List<String> keys = new ArrayList<>();
        for (Term term : termList) {
            if (Param.isKey(term.getNatureStr())) {
                keys.add(term.getName());
            }
        }
        StringBuilder key = new StringBuilder("(");
        for (String s : keys) {
            key.append(s).append("|");
        }
        int lastIndex = key.lastIndexOf("|");
        key.delete(lastIndex, lastIndex + 1).append(")");
        String keyStr = key.toString();
        Date allowDate = DateUtil.getSpecifiedDayAfter(new Date(), 14);
        System.out.println(keyStr);
        return transferComponent.toActivityModelList(activityRepository.search(keyStr, keyStr, keyStr, keyStr,
                allowDate));
    }

    private ActivityModel setSeatsMap(ActivityModel activityModel) {
        List<SeatPrice> seatPriceList = seatPriceRepository.findByActivity_ActivityIdAndSold(activityModel
                .getActivityId(), false);
        Map<Double, Integer> seatPriceMap = new HashMap<>();

        for (SeatPrice seatPrice : seatPriceList) {
            if (seatPrice.getSold()) {
                if (!seatPriceMap.containsKey(seatPrice.getPrice())) {
                    seatPriceMap.put(seatPrice.getPrice(), 0);
                }
            } else {
                if (seatPriceMap.containsKey(seatPrice.getPrice())) {
                    seatPriceMap.put(seatPrice.getPrice(), seatPriceMap.get(seatPrice.getPrice()) + 1);
                } else {
                    seatPriceMap.put(seatPrice.getPrice(), 1);
                }
            }
        }
        activityModel.setPriceMap(seatPriceMap);

        System.out.println(seatPriceMap);
        return activityModel;
    }
}
