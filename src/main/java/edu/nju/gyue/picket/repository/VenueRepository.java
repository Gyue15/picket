package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.entity.Venue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<Venue, String> {

    Venue findByVenueCodeAndPassword(String venueCode, String password);

    Integer countByPayMoneyGreaterThanOrderByUnPayDateAsc(Double payMoney);

    Page<Venue> findByPayMoneyGreaterThan(Double payMoney, Pageable pageable);

    List<Venue> findByVenueCodeIn(List<String> venueCodeList);

}
