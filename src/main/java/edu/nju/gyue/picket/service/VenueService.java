package edu.nju.gyue.picket.service;

import edu.nju.gyue.picket.configuration.param.CheckResult;
import edu.nju.gyue.picket.configuration.param.CheckType;
import edu.nju.gyue.picket.model.ManagerPayModel;
import edu.nju.gyue.picket.model.VenueMessageModel;
import edu.nju.gyue.picket.model.VenueModel;

import java.util.List;

public interface VenueService {

    VenueModel login(String venueCode, String password);

    VenueModel signUp(String venueName, String location, String email, String password, String description, String
            areaGraphUrl, String seatGraphUrl);

    VenueModel getVenue(String venueCode);

    VenueModel getVenueCheck(String venueCode);

    List<VenueModel> getCheckVenueList(CheckType checkType, Integer page, Integer pageSize);

    void modifyVenue(VenueModel venueModel);

    String getAreaGraphUrl(String venueCode);

    String getSeatGraphUrl(String venueCode);

    Integer getPageNum(CheckType checkType, Integer pageSize);

    VenueModel searchVenue(String keyword);

    void checkResult(CheckResult checkResult, String venueCode, String reason);

    VenueMessageModel checkMessage(String venueCode);

    List<ManagerPayModel> getPayList(Integer page, Integer pageSize);

    ManagerPayModel getPayModel(String keyword);

    Integer getPayPageNum(Integer pageSize);

    void pay(List<String> venueCodeList);
}
