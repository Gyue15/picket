package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.entity.SeatPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SeatPriceRepository extends JpaRepository<SeatPrice, String> {

    Integer countByActivity_ActivityIdAndAreaCodeAndSold(Long activityId, Integer areaCode, Boolean sold);

    List<SeatPrice> findByActivity_ActivityId(Long activityId);

    List<SeatPrice> findByActivity_ActivityIdAndSoldAndPrice(Long activityId, Boolean Sold, Double price);

    List<SeatPrice> findByActivity_ActivityIdAndSold(Long activityId, Boolean Sold);

    @Modifying
    @Transactional
    @Query("update SeatPrice as sp set sp.sold = true where sp.seatPriceId in :seatPriceIds")
    void lockSeats(@Param("seatPriceIds") List<String> seatPriceIds);

    @Query(nativeQuery = true, value ="SELECT MIN(s.price) from seat_price as s WHERE s.activity_id = ?1")
    Double findMinPrice(Long activityId);
}
