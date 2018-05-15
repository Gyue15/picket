package edu.nju.gyue.picket.controller;

import com.alibaba.fastjson.JSON;
import edu.nju.gyue.picket.configuration.param.CheckResult;
import edu.nju.gyue.picket.configuration.param.CheckType;
import edu.nju.gyue.picket.configuration.resource.FilePathConfig;
import edu.nju.gyue.picket.model.ManagerPayModel;
import edu.nju.gyue.picket.model.SeatGraphModel;
import edu.nju.gyue.picket.model.VenueMessageModel;
import edu.nju.gyue.picket.model.VenueModel;
import edu.nju.gyue.picket.service.VenueService;
import edu.nju.gyue.picket.util.FileUtil;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/venues", produces = "application/json;charset=UTF-8")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    /**
     * 场馆登录
     *
     * @param venueCode 场馆编码
     * @param password  场馆密码
     * @return 场馆信息
     */
    @PostMapping("/login")
    public VenueModel login(String venueCode, String password) {
        return venueService.login(venueCode, password);

    }

    /**
     * 场馆提交注册申请
     *
     * @param venueName     场馆名称
     * @param location      场馆位置
     * @param email         场馆邮箱
     * @param password      场馆密码
     * @param description   场馆描述
     * @param areaGraph     场馆平面图（json string）
     * @param seatGraphList 场馆座位分布图（json string）
     * @return 场馆信息，包含场馆编码
     */
    @PostMapping("/sign-up")
    public VenueModel signUp(String venueName, String location, String email, String password, String description,
                             String areaGraph, String seatGraphList) {
        String areaGraphUrl = FileUtil.saveFile(areaGraph, FilePathConfig.AREA_GRAPH_PATH);
        String seatGraphUrl = FileUtil.saveFile(seatGraphList, FilePathConfig.SEAT_GRAPH_PATH);

        return venueService.signUp(venueName, location, email, password, description, areaGraphUrl, seatGraphUrl);
    }

    /**
     * 获得已经审核的场馆信息
     *
     * @param venueCode 场馆编码
     * @return 场馆信息
     */
    @GetMapping
    public VenueModel getVenue(@RequestParam("venue-code") String venueCode) {
        return venueService.getVenue(venueCode);
    }

    /**
     * 获得未审核的场馆信息（包括修改和注册；同一个场馆之对应一个未审核信息）
     *
     * @param venueCode 场馆编码
     * @return 场馆信息
     */
    @GetMapping("/check")
    public VenueModel getVenueCheck(@RequestParam("venue-code") String venueCode) {
        return venueService.getVenueCheck(venueCode);
    }

    /**
     * 获得待审核场馆的list，包括修改待审核和注册待审核
     *
     * @param checkType 审核类型（Add or MODIFY）
     * @param page      得到的list的页码数
     * @param pageSize  每页的条目数
     * @return 待审核的场馆的list
     */
    @GetMapping("/check-venues")
    public List<VenueModel> getCheckVenueList(@RequestParam("check-type") CheckType checkType, @RequestParam("page")
            Integer page, @RequestParam("page-size") Integer pageSize) {

        return venueService.getCheckVenueList(checkType, page, pageSize);
    }

    /**
     * 提交修改场馆信息的申请
     *
     * @param venueModel 场馆信息
     */
    @PostMapping("/modify")
    public void modifyVenue(VenueModel venueModel) {
        System.out.println("venueModel: " + venueModel.toString());
        venueService.modifyVenue(venueModel);
    }

    /**
     * 获得场馆的平面图，包括已通过审核和未通过审核的场馆
     *
     * @param venueCode 场馆编码
     * @return 平面图（data属性）
     */
    @GetMapping("/area-graphs")
    public Map<String, String> getAreaGraph(@RequestParam("venue-code") String venueCode) {
        String areaGraphUrl = venueService.getAreaGraphUrl(venueCode);
        Map<String, String> map = new HashMap<>();
        map.put("data", FileUtil.readFile(areaGraphUrl));
        return map;
    }

    /**
     * 获得场馆的座位分布图，包括已通过审核和未通过审核的场馆
     *
     * @param venueCode 场馆编码
     * @return 座位分布图的list，直接将存储的String转成bean即可
     */
    @GetMapping("/seats")
    public List<SeatGraphModel> getSeats(@RequestParam("venue-code") String venueCode) {
        String seatGraphUrl = venueService.getSeatGraphUrl(venueCode);
        return JSON.parseArray(FileUtil.readFile(seatGraphUrl), SeatGraphModel.class);
    }

    /**
     * 获得待审核场馆的总页码
     *
     * @param checkType 审核类型
     * @param pageSize  每页的条目数
     * @return 总页码
     */
    @GetMapping("/page-numbers")
    public Integer getPageNum(@RequestParam("check-type") CheckType checkType, @RequestParam("page-size") Integer
            pageSize) {
        return venueService.getPageNum(checkType, pageSize);
    }

    /**
     * 根据场馆名或编码搜索场馆，不支持模糊搜索
     *
     * @param keyword 场馆名或编码
     * @return 场馆信息
     */
    @GetMapping("/check-venues/{keyword}")
    public VenueModel searchVenue(@PathParam("keyword") String keyword) {
        return venueService.searchVenue(keyword);
    }

    /**
     * 向服务器提交审核信息
     *
     * @param checkResult 审核结果
     * @param venueCode   场馆编码
     * @param reason      审核理由（审核不予通过时填写）
     */
    @PostMapping("/check-result")
    public void checkResult(CheckResult checkResult, String venueCode, String reason) {
        System.out.println("checkResult: " + checkResult + "venueCode: " + venueCode + ", reason: " + reason);
        venueService.checkResult(checkResult, venueCode, reason);
    }


    /**
     * 返回并清空场馆消息（审核信息）
     *
     * @param venueCode 场馆编码
     * @return 场馆消息
     */
    @PostMapping("/messages")
    public VenueMessageModel checkMessage(String venueCode) {
        return venueService.checkMessage(venueCode);
    }

    @GetMapping("/pay-lists")
    public List<ManagerPayModel> getPayList(@RequestParam Integer page, @RequestParam("page-size") Integer pageSize) {
        return venueService.getPayList(page, pageSize);
    }

    @GetMapping("/pay-search")
    public ManagerPayModel getPayModel(@RequestParam String keyword) {
        return venueService.getPayModel(keyword);
    }

    @GetMapping("/pay-page-numbers")
    public Integer getPayPageNum(@RequestParam("page-size") Integer pageSize) {
        return venueService.getPayPageNum(pageSize);
    }

    @PostMapping("/pay")
    public void pay(@RequestBody List<String> venueCodeList) {
        System.out.println("venueList: " + venueCodeList);
        venueService.pay(venueCodeList);
    }

//    private VenueModel fake(String venueCode, boolean inCheck) {
//        VenueModel venueModel = new VenueModel();
//        venueModel.setInCheck(inCheck);
//        venueModel.setEmail("123@123.com");
//        venueModel.setDetail("这是一个简洁这是一个简洁这是一个简洁这是一个简洁这是一个简洁这是一个简洁这是一个简洁这是一个简洁" + "这是一个简洁这是一个简洁这是一个简洁打错了是简介");
//        venueModel.setLocation("江苏省南京市中山路233号");
//        venueModel.setVenueCode(venueCode);
//        venueModel.setVenueName("南京大剧院");
//        venueModel.setCheckTimeString("2018年1月2日 2:00:00");
//        return venueModel;
//    }
//
//    private ManagerPayModel fakePay(int i) {
//        ManagerPayModel managerPayModel = new ManagerPayModel();
//        managerPayModel.setVenueName("南京大剧院" + i);
//        managerPayModel.setTickSales(100.0 * (i  +1));
//        managerPayModel.setPayMoney(70.0 * (i  +1));
//        managerPayModel.setUnPayDateString("2018年1月23日");
//        managerPayModel.setVenueCode("123456" + i);
//        return managerPayModel;
//    }
//
//    private List<VenueModel> fakeList() {
//        List<VenueModel> venueModels = new ArrayList<>();
//        for (int i = 0; i < 5; i++) {
//            venueModels.add(fake("000000" + i, true));
//        }
//        return venueModels;
//    }

}
