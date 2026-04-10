package com.example.patientservice.kafka;

import com.example.patientservice.model.Patient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import patient_event.PatientEvent;

@Slf4j
@Service
public class KafkaProducer {

    private final KafkaTemplate<String,byte[]> kafkaTemplate;

    public KafkaProducer(KafkaTemplate<String,byte[]> kafkaTemplate)
    {
        this.kafkaTemplate=kafkaTemplate;
    }

    public void sendEvent (Patient patient)
    {
        PatientEvent event = PatientEvent.newBuilder().setPatientId(patient.getId().toString())
                .setName(patient.getName())
                .setEmail(patient.getEmail())
                .setEventTyp("Event Created")
                .build();

        try {
        kafkaTemplate.send("Patient",event.toByteArray());
        } catch (Exception e) {
            log.info("error sending patientCreated:{}",event);
        }
    }
}
