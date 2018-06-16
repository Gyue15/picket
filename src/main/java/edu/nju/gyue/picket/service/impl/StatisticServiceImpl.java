package edu.nju.gyue.picket.service.impl;

import edu.nju.gyue.picket.configuration.param.OrderState;
import edu.nju.gyue.picket.configuration.param.Param;
import edu.nju.gyue.picket.configuration.param.UserType;
import edu.nju.gyue.picket.entity.ActivityOrder;
import edu.nju.gyue.picket.entity.Member;
import edu.nju.gyue.picket.entity.Venue;
import edu.nju.gyue.picket.exception.BadRequestException;
import edu.nju.gyue.picket.model.StatisticManagerModel;
import edu.nju.gyue.picket.model.StatisticMemberModel;
import edu.nju.gyue.picket.model.StatisticVenueModel;
import edu.nju.gyue.picket.repository.MemberRepository;
import edu.nju.gyue.picket.repository.OrderRepository;
import edu.nju.gyue.picket.repository.VenueRepository;
import edu.nju.gyue.picket.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticServiceImpl implements StatisticService {

    private final OrderRepository orderRepository;

    private final MemberRepository memberRepository;

    private final VenueRepository venueRepository;

    private final DateFormat dateFormat;

    @Autowired
    public StatisticServiceImpl(OrderRepository orderRepository, MemberRepository memberRepository, VenueRepository
            venueRepository) {
        this.orderRepository = orderRepository;
        this.memberRepository = memberRepository;
        this.venueRepository = venueRepository;
        this.dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    }


    @Override
    public StatisticVenueModel getVenueStatistics(String venueCode) {
        Venue venue = venueRepository.findOne(venueCode);
        if (venue == null || venue.getVenueCode() == null) {
            throw new BadRequestException("场馆编码错误");
        }

        // income
        List<String> incomeX = new LinkedList<>();
        List<Double> incomeY = new ArrayList<>();
        fillChart(incomeX, incomeY, UserType.VENUE, venueCode);
        // 拿到每天的order，然后把order value加在一起

        // order map
        List<ActivityOrder> activityOrderList = orderRepository.findByVenue_VenueCode(venueCode);
        Map<String, Integer> orderMap = getOrderMap(activityOrderList);

        return new StatisticVenueModel(incomeX, incomeY, orderMap, incomeY.get(incomeY.size() - 1), venue.getPayMoney
                ());
    }

    @Override
    public StatisticManagerModel getManagerVenueStatistics() {
        List<Venue> venueList = venueRepository.findAll();
        List<Date> dateList = venueList.stream().map(Venue::getSignDate).collect(Collectors.toList());
        List<String> chartX = new ArrayList<>();
        List<Double> chartY = new ArrayList<>();
        fillManagerChart(chartX, chartY, dateList);
        return new StatisticManagerModel(chartX, chartY);
    }

    @Override
    public StatisticManagerModel getManagerMemberStatistics() {
        List<Member> memberList = memberRepository.findAll();
        List<Date> dateList = memberList.stream().map(Member::getSignDate).collect(Collectors.toList());
        List<String> chartX = new ArrayList<>();
        List<Double> chartY = new ArrayList<>();
        fillManagerChart(chartX, chartY, dateList);
        return new StatisticManagerModel(chartX, chartY);
    }

    @Override
    public StatisticManagerModel getManagerIncomeStatistics() {
        List<String> chartX = new LinkedList<>();
        List<Double> chartY = new ArrayList<>();
        fillChart(chartX, chartY, UserType.MABAGER, "admin");
        return new StatisticManagerModel(chartX, chartY);
    }

    @Override
    public StatisticMemberModel getMemberStatistics(String email) {
        Member member = memberRepository.findOne(email);
        if (member == null || member.getEmail() == null) {
            throw new BadRequestException("不存在此用户");
        }

        List<ActivityOrder> activityOrderList = orderRepository.findByMember_Email(email);
        // consume type
        Map<String, Integer> consumeMap = new HashMap<>();
        activityOrderList.forEach(t -> {
            String key = t.getActivity().getActivityType();
            if (consumeMap.containsKey(key)) {
                consumeMap.put(key, consumeMap.get(key) + 1);
            } else {
                consumeMap.put(key, 1);
            }
        });

        // order type
        Map<String, Integer> orderMap = getOrderMap(activityOrderList);

        // consume statistic
        List<String> chartX = new LinkedList<>();
        List<Double> chartY = new ArrayList<>();
        fillChart(chartX, chartY, UserType.MEMBER, email);
        Map<String, Double> consumeStatistic = new HashMap<>();
        for (int i = 0; i < chartX.size(); i++) {
            consumeStatistic.put(chartX.get(i), chartY.get(i));
        }

        return new StatisticMemberModel(consumeMap, consumeStatistic, orderMap);
    }

    private void fillManagerChart(List<String> chartX, List<Double> chartY, List<Date> dateList) {
        Map<String, Double> statisticMap = new TreeMap<>();
        dateList.forEach(date -> {
            String key = dateFormat.format(date);
            if (statisticMap.containsKey(key)) {
                statisticMap.put(key, statisticMap.get(key) + 1.0);
            } else {
                statisticMap.put(key, 1.0);
            }
        });
        for (Map.Entry<String, Double> entry : statisticMap.entrySet()) {
            chartX.add(entry.getKey());
            chartY.add(entry.getValue());
        }
    }

    private Map<String, Integer> getOrderMap(List<ActivityOrder> activityOrderList) {
        Map<String, Integer> orderMap = new HashMap<>();
        activityOrderList.forEach(t -> {
            String key = t.getOrderState().getString();
            if (orderMap.containsKey(key)) {
                orderMap.put(key, orderMap.get(key) + 1);
            } else {
                orderMap.put(key, 1);
            }
        });
        return orderMap;
    }

    private void fillChart(List<String> chartX, List<Double> chartY, UserType userType, String id) {
        List<ActivityOrder> activityOrderList;
        List<OrderState> orderStateList = new ArrayList<>();
        orderStateList.add(OrderState.PAID_AND_UNMAIL);
        orderStateList.add(OrderState.PAID_AND_MAIL);
        double percent;
        switch (userType) {
            case MABAGER:
                activityOrderList = orderRepository.findByOrderStateIn(orderStateList);
                percent = 1 - Param.MONEY_PERCENT;
                break;
            case VENUE:
                activityOrderList = orderRepository.findByOrderStateInAndVenue_VenueCode(orderStateList, id);
                percent = Param.MONEY_PERCENT;
                break;
            case MEMBER:
                activityOrderList = orderRepository.findByOrderStateInAndMember_Email(orderStateList, id);
                percent = 1.0;
                break;
            default:
                throw new BadRequestException("不支持这种用户类型");
        }
        Map<String, Double> resultMap = new TreeMap<>();
        activityOrderList.forEach(activityOrder -> {
            String key = dateFormat.format(activityOrder.getPlaceDate());
            if (resultMap.containsKey(key)) {
                resultMap.put(key, resultMap.get(key) + activityOrder.getOrderValue() * percent);
            } else {
                resultMap.put(key, activityOrder.getOrderValue() * percent);
            }
        });

        for (Map.Entry<String, Double> entry : resultMap.entrySet()) {
            chartX.add(entry.getKey());
            chartY.add(entry.getValue());
        }

    }

}


