package com.example.billingservice.repository;

import com.example.billingservice.model.BillingAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

// ✅ BATCH 3 FIX: New repository for billing account persistence
@Repository
public interface BillingAccountRepository extends JpaRepository<BillingAccount, UUID> {
    Optional<BillingAccount> findByPatientId(String patientId);
    boolean existsByPatientId(String patientId);
}
