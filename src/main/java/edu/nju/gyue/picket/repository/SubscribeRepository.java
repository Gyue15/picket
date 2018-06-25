package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.entity.Subscribe;
import edu.nju.gyue.picket.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface SubscribeRepository extends JpaRepository<Subscribe, Integer> {

    List<Subscribe> findByUserEmail(String userEmail);

    List<Subscribe> findByUserEmailAndIsAvailable(String userEmail, int isAvailable);

    List<Subscribe> findByActivityId(int activityId);

    Subscribe findByUserEmailAndActivityId(String userEmail, int activityId);
}
