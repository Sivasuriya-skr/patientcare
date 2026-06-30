package com.example.patientservice.grpc;

import billing.BillingRequest;
import billing.BillingResponse;
import billing.BillingServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class BillingServiceGrpcClient {

    private final BillingServiceGrpc.BillingServiceBlockingStub blockingStub;
    // ✅ BATCH 2 FIX: Keep a reference to the channel so it can be properly shut down
    private final ManagedChannel channel;

    public BillingServiceGrpcClient(
            @Value("${billing.service.address:localhost}") String serverAddress,
            @Value("${billing.service.grpc.port:9001}") int serverPort) {

        log.info("Connecting to billing service gRPC at {}:{}", serverAddress, serverPort);

        this.channel = ManagedChannelBuilder.forAddress(serverAddress, serverPort)
                .usePlaintext()
                .build();

        this.blockingStub = BillingServiceGrpc.newBlockingStub(channel);
    }

    public BillingResponse createBillingAccount(String patientId, String name, String email) {
        BillingRequest request = BillingRequest.newBuilder()
                .setPatientId(patientId)
                .setName(name)
                .setEmail(email)
                .build();

        BillingResponse response = blockingStub.createBillingAccount(request);
        log.info("Received response from billing service via gRPC: {}", response);
        return response;
    }

    // ✅ BATCH 2 FIX: Properly shut down the gRPC channel on app shutdown to prevent thread/connection leaks
    @PreDestroy
    public void shutdown() {
        log.info("Shutting down gRPC channel to billing service...");
        try {
            channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
            log.info("gRPC channel shut down successfully.");
        } catch (InterruptedException e) {
            log.warn("gRPC channel shutdown interrupted: {}", e.getMessage());
            Thread.currentThread().interrupt();
        }
    }
}
