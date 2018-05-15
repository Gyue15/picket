package edu.nju.gyue.picket.repository;

import edu.nju.gyue.picket.entity.PayAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayAccountRepository extends JpaRepository<PayAccount, String> {

    PayAccount findByAccountIdAndPassword(String accountId, String password);
}
