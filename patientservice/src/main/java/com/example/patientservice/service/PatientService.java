package com.example.patientservice.service;

import com.example.patientservice.grpc.BillingServiceGrpcClient;
import com.example.patientservice.kafka.KafkaProducer;
import org.springframework.stereotype.Service;

import java.util.UUID;
import com.example.patientservice.repository.PatientRepository;

import java.util.List;
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
                          BillingServiceGrpcClient billingServiceGrpcClient, KafkaProducer kafkaProducer)
    {
        this.patientRepository = patientRepository;
        this.billingServiceGrpcClient=billingServiceGrpcClient;
        this.kafkaProducer = kafkaProducer;
    }

    public List<PatientResponseDto> getPatient()
    {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream().map(PatientMapper::toDto).toList();
    }

    // ✅ ADD THIS METHOD
    public PatientResponseDto createPatient(PatientRequestDto dto)
    {
      if (patientRepository.existsByEmail(dto.getEmail())) {
    throw new EmailAlreadyExistsException(
        "A patient with this email already exists " + dto.getEmail()
    );
}

        // Convert DTO -> Entity
        Patient patient = PatientMapper.toEntity(dto);

        // Save to DB
        patient = patientRepository.save(patient);
        billingServiceGrpcClient.createBillingAccount(patient.getId().toString(),patient.getName(),patient.getEmail());

        kafkaProducer.sendEvent(patient);
        // Convert Entity -> DTO
        return PatientMapper.toDto(patient);
    }

    public PatientResponseDto updatePatient(UUID id,PatientRequestDto dto)
    {
        Patient patient=patientRepository.findById(id).orElseThrow(()->  new PatientNotFoundException("A patient not found: "+id));

        if (patientRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
            throw new EmailAlreadyExistsException(
                "A patient with this email already exists " + dto.getEmail()
            );
        }
        patient.setName(dto.getName());
        patient.setAddress(dto.getAddress());
        patient.setEmail(dto.getEmail());
        patient.setDateOfBirth(dto.getDateOfBirth());
        Patient updatedPatient=patientRepository.save(patient);
        return PatientMapper.toDto(updatedPatient);
    }
    public void deletePatient(UUID id)
    {
        patientRepository.deleteById(id);
    }

}
