package edu.nju.gyue.picket.controller;

import edu.nju.gyue.picket.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    private final ManagerService managerService;

    @Autowired
    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @PostMapping("/login")
    public Map<String, String> login(String managerId, String password) {
        Map<String, String> res = new HashMap<>();
        res.put("managerId", managerService.login(managerId, password));
        return res;
    }
}
