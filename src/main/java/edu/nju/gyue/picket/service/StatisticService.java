package edu.nju.gyue.picket.service;

import edu.nju.gyue.picket.model.StatisticManagerModel;
import edu.nju.gyue.picket.model.StatisticMemberModel;
import edu.nju.gyue.picket.model.StatisticVenueModel;

public interface StatisticService {

    StatisticVenueModel getVenueStatistics(String venueCode);

    StatisticManagerModel getManagerVenueStatistics();

    StatisticManagerModel getManagerMemberStatistics();

    StatisticManagerModel getManagerIncomeStatistics();

    StatisticMemberModel getMemberStatistics(String email);


}
