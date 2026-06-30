package com.example.patientservice.controller;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
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
@Tag(name = "Patients", description = "API for managing Patients")
public class PatientController {

   private final PatientService patientService;

   public PatientController(PatientService patientService) {
      this.patientService = patientService;
   }

   // ✅ BATCH 3 FIX: Added pagination support — was returning ALL patients with no limit
   @GetMapping
   @Operation(summary = "Get all patients (paginated)")
   public ResponseEntity<Page<PatientResponseDto>> getPatients(
         @PageableDefault(size = 20, sort = "id") Pageable pageable) {
      return ResponseEntity.ok(patientService.getPatients(pageable));
   }

   // ✅ BATCH 3 FIX: New endpoint — GET /patients/{id} was completely missing
   @GetMapping("/{id}")
   @Operation(summary = "Get a single patient by ID")
   public ResponseEntity<PatientResponseDto> getPatientById(@PathVariable UUID id) {
      return ResponseEntity.ok(patientService.getPatientById(id));
   }

   @PostMapping
   @Operation(summary = "Create a new patient")
   public ResponseEntity<PatientResponseDto> createPatient(
         @Validated({Default.class, CreatePatientValidationGroup.class})
         @RequestBody PatientRequestDto patientRequestDto) {
      PatientResponseDto patientResponseDto = patientService.createPatient(patientRequestDto);
      // ✅ BATCH 2 FIX: Returns 201 CREATED (was 200 OK — semantically wrong for resource creation)
      return ResponseEntity.status(HttpStatus.CREATED).body(patientResponseDto);
   }

   @PutMapping("/{id}")
   @Operation(summary = "Update a patient")
   public ResponseEntity<PatientResponseDto> updatePatient(
         @PathVariable UUID id,
         @Validated({Default.class}) @RequestBody PatientRequestDto patientRequestDto) {
      PatientResponseDto patientResponseDto = patientService.updatePatient(id, patientRequestDto);
      return ResponseEntity.ok().body(patientResponseDto);
   }

   @DeleteMapping("/{id}")
   @Operation(summary = "Delete a patient")
   public ResponseEntity<Void> deletePatient(@PathVariable UUID id) {
      patientService.deletePatient(id);
      return ResponseEntity.noContent().build();
   }
}