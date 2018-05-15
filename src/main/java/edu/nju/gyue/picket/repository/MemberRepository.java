package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, String> {

    Member findByEmailAndPassword(String email, String password);
}
