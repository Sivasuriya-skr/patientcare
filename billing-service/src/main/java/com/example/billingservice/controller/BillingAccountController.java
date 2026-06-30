package com.example.billingservice.controller;

import com.example.billingservice.dto.BillingAccountResponseDTO;
import com.example.billingservice.service.BillingAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/billing/accounts")
public class BillingAccountController {

    private final BillingAccountService billingAccountService;

    public BillingAccountController(BillingAccountService billingAccountService) {
        this.billingAccountService = billingAccountService;
    }

    @GetMapping
    public ResponseEntity<List<BillingAccountResponseDTO>> getAllAccounts() {
        return ResponseEntity.ok(billingAccountService.getAllAccounts());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<BillingAccountResponseDTO> getByPatientId(@PathVariable String patientId) {
        return ResponseEntity.ok(billingAccountService.getByPatientId(patientId));
    }
}
