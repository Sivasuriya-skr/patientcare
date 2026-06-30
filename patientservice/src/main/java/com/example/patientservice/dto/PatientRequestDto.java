package com.example.patientservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

import com.example.patientservice.dto.validators.CreatePatientValidationGroup;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

// ✅ BATCH 2 FIX: @Data replaces ~40 lines of manual getters/setters
@Data
public class PatientRequestDto {

    @NotBlank(message = "name is required")
    @Size(max = 100, message = "size should not exceed 100 characters")
    private String name;

    @NotBlank(message = "email is required")
    @Email(message = "enter a valid email")
    private String email;

    @NotBlank(message = "address is required")
    private String address;

    @NotNull(message = "date of birth is required")
    @Past(message = "date of birth must be in the past")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    // ✅ @NotNull is correct for LocalDate (was @NotBlank which only works on Strings)
    @NotNull(groups = CreatePatientValidationGroup.class, message = "registered date is required")
    @PastOrPresent(message = "registered date cannot be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate registeredDate;
}