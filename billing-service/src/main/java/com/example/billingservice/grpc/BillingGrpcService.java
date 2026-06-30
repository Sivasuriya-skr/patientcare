package com.example.billingservice.grpc;

import billing.BillingResponse;
import billing.BillingServiceGrpc.BillingServiceImplBase;
import com.example.billingservice.model.BillingAccount;
import com.example.billingservice.repository.BillingAccountRepository;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@GrpcService
public class BillingGrpcService extends BillingServiceImplBase {

    private static final Logger log = LoggerFactory.getLogger(BillingGrpcService.class);

    // ✅ BATCH 3 FIX: Inject repository to persist billing accounts to the DB
    private final BillingAccountRepository billingAccountRepository;

    public BillingGrpcService(BillingAccountRepository billingAccountRepository) {
        this.billingAccountRepository = billingAccountRepository;
    }

    @Override
    public void createBillingAccount(billing.BillingRequest billingRequest,
                                     StreamObserver<billing.BillingResponse> responseObserver) {

        log.info("createBillingAccount request received for patientId={}", billingRequest.getPatientId());

        // ✅ BATCH 3 FIX: Guard against duplicate billing accounts
        if (billingAccountRepository.existsByPatientId(billingRequest.getPatientId())) {
            log.warn("Billing account already exists for patientId={}", billingRequest.getPatientId());
            BillingAccount existing = billingAccountRepository
                    .findByPatientId(billingRequest.getPatientId())
                    .orElseThrow();
            responseObserver.onNext(BillingResponse.newBuilder()
                    .setAccountId(existing.getId().toString())
                    .setStatus(existing.getStatus())
                    .build());
            responseObserver.onCompleted();
            return;
        }

        // ✅ BATCH 3 FIX: Actually save to DB — was previously hardcoded "12345" and never persisted
        BillingAccount account = new BillingAccount(
                billingRequest.getPatientId(),
                billingRequest.getName(),
                billingRequest.getEmail()
        );
        BillingAccount saved = billingAccountRepository.save(account);

        log.info("Billing account created successfully: accountId={}, patientId={}",
                saved.getId(), saved.getPatientId());

        BillingResponse response = BillingResponse.newBuilder()
                .setAccountId(saved.getId().toString())  // ✅ Real generated UUID, not hardcoded "12345"
                .setStatus(saved.getStatus())
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
