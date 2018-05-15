package edu.nju.gyue.picket.service.impl;

import edu.nju.gyue.picket.entity.Manager;
import edu.nju.gyue.picket.exception.BadRequestException;
import edu.nju.gyue.picket.repository.ManagerRepository;
import edu.nju.gyue.picket.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ManagerServiceImpl implements ManagerService {

    private final ManagerRepository managerRepository;

    @Autowired
    public ManagerServiceImpl(ManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    @Override
    public String login(String managerId, String password) {
        Manager manager= managerRepository.findByManagerIdAndPassword(managerId, password);
        if (manager == null || manager.getManagerId() == null) {
            throw new BadRequestException("管理员名或密码错误");
        }
        return manager.getManagerId();
    }
}
