package com.example.patientservice.service;

import com.example.patientservice.grpc.BillingServiceGrpcClient;
import com.example.patientservice.kafka.KafkaProducer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import com.example.patientservice.repository.PatientRepository;

import com.example.patientservice.dto.PatientRequestDto;
import com.example.patientservice.dto.PatientResponseDto;
import com.example.patientservice.mapper.PatientMapper;
import com.example.patientservice.model.Patient;
import com.example.patientservice.exception.EmailAlreadyExistsException;
import com.example.patientservice.exception.PatientNotFoundException;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final BillingServiceGrpcClient billingServiceGrpcClient;
    private final KafkaProducer kafkaProducer;

    public PatientService(PatientRepository patientRepository,
                          BillingServiceGrpcClient billingServiceGrpcClient,
                          KafkaProducer kafkaProducer) {
        this.patientRepository = patientRepository;
        this.billingServiceGrpcClient = billingServiceGrpcClient;
        this.kafkaProducer = kafkaProducer;
    }

    // ✅ BATCH 3 FIX: Now returns a Page (paginated) instead of all patients at once
    public Page<PatientResponseDto> getPatients(Pageable pageable) {
        return patientRepository.findAll(pageable)
                .map(PatientMapper::toDto);
    }

    // ✅ BATCH 3 FIX: New method — GET /patients/{id} endpoint was completely missing
    public PatientResponseDto getPatientById(UUID id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found: " + id));
        return PatientMapper.toDto(patient);
    }

    // ✅ BATCH 2 FIX: @Transactional ensures DB save + gRPC call are atomic.
    // If gRPC fails after DB save, the transaction rolls back — no orphaned records.
    @Transactional
    public PatientResponseDto createPatient(PatientRequestDto dto) {
        if (patientRepository.existsByEmail(dto.getEmail())) {
            throw new EmailAlreadyExistsException(
                "A patient with this email already exists: " + dto.getEmail()
            );
        }

        Patient patient = PatientMapper.toEntity(dto);
        patient = patientRepository.save(patient);

        billingServiceGrpcClient.createBillingAccount(
                patient.getId().toString(),
                patient.getName(),
                patient.getEmail()
        );

        kafkaProducer.sendEvent(patient);
        return PatientMapper.toDto(patient);
    }

    @Transactional
    public PatientResponseDto updatePatient(UUID id, PatientRequestDto dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found: " + id));

        if (patientRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
            throw new EmailAlreadyExistsException(
                "A patient with this email already exists: " + dto.getEmail()
            );
        }

        patient.setName(dto.getName());
        patient.setAddress(dto.getAddress());
        patient.setEmail(dto.getEmail());
        patient.setDateOfBirth(dto.getDateOfBirth());

        Patient updatedPatient = patientRepository.save(patient);
        return PatientMapper.toDto(updatedPatient);
    }

    @Transactional
    public void deletePatient(UUID id) {
        // ✅ BATCH 2 FIX: Check existence before delete — was silently succeeding for non-existent IDs
        if (!patientRepository.existsById(id)) {
            throw new PatientNotFoundException("Patient not found: " + id);
        }
        patientRepository.deleteById(id);
    }
}
