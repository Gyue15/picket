package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.entity.VenueMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenueMessageRepository extends JpaRepository<VenueMessage, Long> {

    List<VenueMessage> findByVenue_VenueCodeAndNeedDisplayOrderByVenueMessageIdDesc(String venueCode, Boolean
            needDisplay);
}
