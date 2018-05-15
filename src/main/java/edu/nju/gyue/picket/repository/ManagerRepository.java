package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.entity.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManagerRepository extends JpaRepository<Manager, String> {
    Manager findByManagerIdAndPassword(String managerId, String password);
}
