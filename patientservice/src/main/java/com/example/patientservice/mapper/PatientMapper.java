package com.example.patientservice.mapper;

import com.example.patientservice.dto.PatientRequestDto;
import com.example.patientservice.dto.PatientResponseDto;
import com.example.patientservice.model.Patient;


public class PatientMapper {

    // ✅ Entity → Response DTO
    public static PatientResponseDto toDto(Patient patient) {
        PatientResponseDto patientDto = new PatientResponseDto();

        patientDto.setId(patient.getId().toString());
        patientDto.setName(patient.getName());
        patientDto.setAddress(patient.getAddress());
        patientDto.setEmail(patient.getEmail());
        // ✅ Updated: field renamed from date_Of_Birth → dateOfBirth (camelCase)
        patientDto.setDateOfBirth(patient.getDateOfBirth().toString());

        return patientDto;
    }

    // ✅ Request DTO → Entity
    public static Patient toEntity(PatientRequestDto dto) {
        Patient patient = new Patient();

        patient.setName(dto.getName());
        patient.setAddress(dto.getAddress());
        patient.setEmail(dto.getEmail());
        
        // No need to parse - already LocalDate in DTO
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setRegisteredDate(dto.getRegisteredDate());

        return patient;
    }
}