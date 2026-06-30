package com.example.billingservice.exception;

public class BillingAccountNotFoundException extends RuntimeException {

    public BillingAccountNotFoundException(String patientId) {
        super("Billing account not found for patient: " + patientId);
    }
}
