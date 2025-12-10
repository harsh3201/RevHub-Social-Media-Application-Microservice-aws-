package com.revhub.sagaorchestrator.controller;

import com.revhub.sagaorchestrator.model.SagaInstance;
import com.revhub.sagaorchestrator.service.SagaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saga")
@RequiredArgsConstructor
public class SagaController {
    
    private final SagaService sagaService;
    
    @PostMapping("/start")
    public ResponseEntity<SagaInstance> startSaga(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(sagaService.startSaga(request.get("sagaType"), request.get("payload")));
    }
    
    @PutMapping("/{sagaId}/step")
    public ResponseEntity<SagaInstance> updateStep(@PathVariable Long sagaId, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(sagaService.updateSagaStep(sagaId, request.get("step"), request.get("status")));
    }
    
    @PostMapping("/{sagaId}/complete")
    public ResponseEntity<Void> completeSaga(@PathVariable Long sagaId) {
        sagaService.completeSaga(sagaId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{sagaId}/compensate")
    public ResponseEntity<Void> compensateSaga(@PathVariable Long sagaId) {
        sagaService.compensateSaga(sagaId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<SagaInstance>> getSagasByStatus(@PathVariable String status) {
        return ResponseEntity.ok(sagaService.getSagasByStatus(status));
    }
}
