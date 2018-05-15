package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.configuration.param.OrderState;
import edu.nju.gyue.picket.configuration.param.OrderType;
import edu.nju.gyue.picket.entity.ActivityOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<ActivityOrder, Long> {
    Integer countByMember_EmailAndOrderState(String email, OrderState orderState);

    Integer countByVenue_VenueCode(String venueCode);

    Page<ActivityOrder> findByMember_EmailAndOrderState(String email, Pageable pageable, OrderState orderState);

    Page<ActivityOrder> findByVenue_VenueCode(String venueCode, Pageable pageable);

    List<ActivityOrder> findByVenue_VenueCode(String venueCode);

    List<ActivityOrder> findByMember_Email(String email);

    List<ActivityOrder> findByOrderType(OrderType orderType);

    List<ActivityOrder> findByOrderStateIn(List<OrderState> orderStateList);

    List<ActivityOrder> findByOrderStateInAndVenue_VenueCode(List<OrderState> orderStateList, String venueCode);

    List<ActivityOrder> findByOrderStateInAndMember_Email(List<OrderState> orderStateList, String email);

    List<ActivityOrder> findByOrderState(OrderState orderState);
}

