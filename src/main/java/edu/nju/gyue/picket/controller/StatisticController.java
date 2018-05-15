package edu.nju.gyue.picket.controller;

import edu.nju.gyue.picket.configuration.param.ManagerStatisticType;
import edu.nju.gyue.picket.exception.BadRequestException;
import edu.nju.gyue.picket.model.StatisticManagerModel;
import edu.nju.gyue.picket.model.StatisticMemberModel;
import edu.nju.gyue.picket.model.StatisticVenueModel;
import edu.nju.gyue.picket.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticController {

    private final StatisticService statisticService;

    @Autowired
    public StatisticController(StatisticService statisticService) {
        this.statisticService = statisticService;
    }

    @GetMapping("/venues")
    public StatisticVenueModel getVenueStatistics(@RequestParam("venue-code") String venueCode) {

        return statisticService.getVenueStatistics(venueCode);
    }

    @GetMapping("/managers")
    public StatisticManagerModel getManagerStatistics(@RequestParam("manager-statistic-type") ManagerStatisticType
                                                                  managerStatisticType) {
        switch (managerStatisticType) {
            case VENUE:
                return statisticService.getManagerVenueStatistics();
            case MEMBER:
                return statisticService.getManagerMemberStatistics();
            case FINANCE:
                return statisticService.getManagerIncomeStatistics();
            default:
                throw new BadRequestException("没有该种统计图");
        }
    }

    @GetMapping("/members")
    public StatisticMemberModel getMemberStatistics(@RequestParam String email) {
        return statisticService.getMemberStatistics(email);
    }

//    private StatisticManagerModel fake() {
//        StatisticManagerModel statisticManagerModel = new StatisticManagerModel();
//        List<String> incomeX = new ArrayList<>();
//        for (int i = 1; i < 31; i++) {
//            incomeX.add("2018-1-" + i);
//        }
//        statisticManagerModel.setChartX(incomeX);
//
//        List<Double> incomeY = new ArrayList<>();
//        for (int i = 0; i < 30; i++) {
//            incomeY.add(Math.random() * 100);
//        }
//        statisticManagerModel.setChartY(incomeY);
//        return statisticManagerModel;
//    }


}
