package com.example.patientservice.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.UUID;
import com.example.patientservice.dto.PatientRequestDto;
import com.example.patientservice.dto.PatientResponseDto;
import com.example.patientservice.dto.validators.CreatePatientValidationGroup;
import com.example.patientservice.service.PatientService;
import jakarta.validation.groups.Default;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/patients")
@Tag(name = "Patients",description = "API for managing Patients")
public class PatientController {
   private final PatientService patientService;

   public PatientController(PatientService patientService) {
    this.patientService = patientService;
   }
   
   @GetMapping
   @Operation(summary = "get patients")
   public ResponseEntity<List<PatientResponseDto>> getPatients()
   {
      List<PatientResponseDto> patients=patientService.getPatient();
      return ResponseEntity.ok().body(patients);
   }

   @PostMapping 
   @Operation(summary = "create a new patient")
   public ResponseEntity<PatientResponseDto> createPatient(@Validated({Default.class,CreatePatientValidationGroup.class}) @RequestBody PatientRequestDto patientRequestDto)
      {
         PatientResponseDto patientResponseDto =patientService.createPatient(patientRequestDto);

         return ResponseEntity.ok().body(patientResponseDto);
      }
   @PutMapping("/{id}")
   @Operation(summary = "update the patient")
   public ResponseEntity<PatientResponseDto> updatePatient(@PathVariable UUID id,
      @Validated({Default.class}) @RequestBody PatientRequestDto patientRequestDto)
   {
      PatientResponseDto patientResponseDto=patientService.updatePatient(id, patientRequestDto);
      return ResponseEntity.ok().body(patientResponseDto);
   }
   @DeleteMapping("/{id}")
   @Operation(summary = "delete the patient")
   public ResponseEntity<Void> deletePatient(@PathVariable UUID id)
   {
      patientService.deletePatient(id);
      return ResponseEntity.noContent().build();
   }
}
 