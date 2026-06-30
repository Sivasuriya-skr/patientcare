package com.example.patientservice.kafka;

import com.example.patientservice.model.Patient;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import patient_event.PatientEvent;

@Slf4j
@Service
public class KafkaProducer {

    public static final String PATIENT_TOPIC = "patient";

    // ✅ FIXED: Changed from byte[] to String
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public KafkaProducer(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendEvent(Patient patient) {
        PatientEvent event = PatientEvent.newBuilder()
                .setPatientId(patient.getId().toString())
                .setName(patient.getName())
                .setEmail(patient.getEmail())
                .setEventTyp("PATIENT_CREATED")
                .build();

        try {
            // ✅ FIXED: Convert protobuf to JSON String instead of byte array
            String jsonEvent = objectMapper.writeValueAsString(event.toBuilder().build());
            kafkaTemplate.send(PATIENT_TOPIC, jsonEvent);
            log.info("Patient event sent successfully for patientId={}", patient.getId());
        } catch (Exception e) {
            log.error("Error sending patient event for patientId={}: {}", patient.getId(), e.getMessage(), e);
        }
    }
}