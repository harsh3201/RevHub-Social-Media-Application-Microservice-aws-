package com.revhub.sagaorchestrator.repository;

import com.revhub.sagaorchestrator.model.SagaInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SagaInstanceRepository extends JpaRepository<SagaInstance, Long> {
    List<SagaInstance> findByStatus(String status);
    List<SagaInstance> findBySagaType(String sagaType);
}
