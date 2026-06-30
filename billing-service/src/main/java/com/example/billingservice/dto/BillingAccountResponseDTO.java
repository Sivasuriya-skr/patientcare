package com.example.billingservice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class BillingAccountResponseDTO {

    private UUID id;
    private String patientId;
    private String patientName;
    private String patientEmail;
    private String status;
    private LocalDateTime createdAt;
}
