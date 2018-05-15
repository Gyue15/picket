package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Page<Ticket> findByMember_EmailAndBeginTimeAfter(String email, Date beginTime, Pageable pageable);

    Integer countByMember_EmailAndBeginTimeAfter(String email, Date beginTim);
}
