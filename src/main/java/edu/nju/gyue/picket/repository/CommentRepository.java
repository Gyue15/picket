package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByActivity_ActivityId(Long activityId, Pageable pageable);

    Integer countByActivity_ActivityId(Long activityId);

}
