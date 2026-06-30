package com.example.patientservice.dto;

import lombok.Data;

// ✅ BATCH 2 FIX: @Data replaces ~35 lines of manual getters/setters
@Data
public class PatientResponseDto {
    private String id;
    private String name;
    private String email;
    private String address;
    private String dateOfBirth;  // ✅ Renamed from date_Of_Birth → camelCase convention
}
