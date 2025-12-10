package com.revhub.sagaorchestrator.service;

import com.revhub.sagaorchestrator.model.SagaInstance;
import com.revhub.sagaorchestrator.repository.SagaInstanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SagaService {
    
    private final SagaInstanceRepository sagaInstanceRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    public SagaInstance startSaga(String sagaType, String payload) {
        SagaInstance saga = new SagaInstance();
        saga.setSagaType(sagaType);
        saga.setStatus("STARTED");
        saga.setPayload(payload);
        saga.setCurrentStep("INIT");
        saga = sagaInstanceRepository.save(saga);
        kafkaTemplate.send("saga-events", "SAGA_STARTED", saga);
        return saga;
    }
    
    public SagaInstance updateSagaStep(Long sagaId, String step, String status) {
        SagaInstance saga = sagaInstanceRepository.findById(sagaId)
                .orElseThrow(() -> new RuntimeException("Saga not found"));
        saga.setCurrentStep(step);
        saga.setStatus(status);
        return sagaInstanceRepository.save(saga);
    }
    
    public void completeSaga(Long sagaId) {
        SagaInstance saga = sagaInstanceRepository.findById(sagaId)
                .orElseThrow(() -> new RuntimeException("Saga not found"));
        saga.setStatus("COMPLETED");
        sagaInstanceRepository.save(saga);
        kafkaTemplate.send("saga-events", "SAGA_COMPLETED", saga);
    }
    
    public void compensateSaga(Long sagaId) {
        SagaInstance saga = sagaInstanceRepository.findById(sagaId)
                .orElseThrow(() -> new RuntimeException("Saga not found"));
        saga.setStatus("COMPENSATING");
        sagaInstanceRepository.save(saga);
        kafkaTemplate.send("saga-events", "SAGA_COMPENSATING", saga);
    }
    
    public List<SagaInstance> getSagasByStatus(String status) {
        return sagaInstanceRepository.findByStatus(status);
    }
}
