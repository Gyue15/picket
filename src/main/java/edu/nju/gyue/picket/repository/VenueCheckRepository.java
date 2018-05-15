package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.configuration.param.CheckType;
import edu.nju.gyue.picket.entity.VenueCheck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueCheckRepository extends JpaRepository<VenueCheck, String> {

    Page<VenueCheck> findByInCheckAndCheckType(Boolean inCheck, CheckType checkType, Pageable pageable);

    Integer countByInCheckAndCheckType(Boolean inCheck, CheckType checkType);
}
