package com.example.billingservice.service;

import com.example.billingservice.dto.BillingAccountResponseDTO;
import com.example.billingservice.exception.BillingAccountNotFoundException;
import com.example.billingservice.model.BillingAccount;
import com.example.billingservice.repository.BillingAccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillingAccountService {

    private final BillingAccountRepository billingAccountRepository;

    public BillingAccountService(BillingAccountRepository billingAccountRepository) {
        this.billingAccountRepository = billingAccountRepository;
    }

    public List<BillingAccountResponseDTO> getAllAccounts() {
        return billingAccountRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public BillingAccountResponseDTO getByPatientId(String patientId) {
        BillingAccount account = billingAccountRepository.findByPatientId(patientId)
                .orElseThrow(() -> new BillingAccountNotFoundException(patientId));
        return toDto(account);
    }

    private BillingAccountResponseDTO toDto(BillingAccount account) {
        BillingAccountResponseDTO dto = new BillingAccountResponseDTO();
        dto.setId(account.getId());
        dto.setPatientId(account.getPatientId());
        dto.setPatientName(account.getPatientName());
        dto.setPatientEmail(account.getPatientEmail());
        dto.setStatus(account.getStatus());
        dto.setCreatedAt(account.getCreatedAt());
        return dto;
    }
}
