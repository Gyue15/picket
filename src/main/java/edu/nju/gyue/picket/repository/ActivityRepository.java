package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.entity.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    Integer countByBeginDateAfter(Date allowDate);

    Integer countByBeginDateAfterAndVenue_VenueCode(Date nowDate, String venueCode);

    Integer countByBeginDateBeforeAndVenue_VenueCode(Date nowDate, String venueCode);

    Page<Activity> findByBeginDateAfter(Date allowDate, Pageable pageable);

    Page<Activity> findByBeginDateAfterAndVenue_VenueCode(Date nowDate, String venueCode, Pageable pageable);

    Page<Activity> findByBeginDateBeforeAndVenue_VenueCode(Date nowDate, String venueCode, Pageable pageable);

    List<Activity> findByBeginDateLessThanEqualAndEndDateGreaterThanEqualAndVenue_VenueCode(Date fromDate, Date
            toDate, String venueCode);

    List<Activity> findByBeginDateGreaterThanEqualAndBeginDateLessThanEqualAndVenue_VenueCode(Date fromDate, Date
            toDate, String venueCode);

    @Query(nativeQuery = true, value = "SELECT * FROM activity AS a LEFT JOIN venue AS v ON a.venue_code = v" +
            ".venue_code WHERE (v.venue_name REGEXP ?1 OR a.activity_name REGEXP ?2 OR a.description REGEXP ?3 OR a" +
            ".activity_type REGEXP ?4) AND a.begin_date > ?5")
    List<Activity> search(String key1, String key2, String key3, String key4, Date allowDate);

    List<Activity> findByActivityTypeContaining(String activityType);
}

