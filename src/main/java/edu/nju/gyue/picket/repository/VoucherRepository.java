package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {

    List<Voucher> findByMember_EmailAndIsUsedAndLeastMoneyLessThanEqualAndLeastDateAfter(String email, Boolean
            isUsed, Double leastMoney, Date nowDate);

    Page<Voucher> findByMember_EmailAndIsUsedAndLeastDateAfter(String email, Boolean isUsed, Date nowDate, Pageable pageable);

    Integer countByMember_EmailAndIsUsedAndLeastDateAfter(String email, Boolean isUsed, Date nowDate);
}
