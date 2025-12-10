package com.revhub.searchservice.service;

import com.revhub.searchservice.model.SearchIndex;
import com.revhub.searchservice.repository.SearchIndexRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {
    
    private final SearchIndexRepository searchIndexRepository;
    
    public List<SearchIndex> search(String query) {
        return searchIndexRepository.findBySearchableTextContainingIgnoreCase(query);
    }
    
    public List<SearchIndex> searchByType(String entityType, String query) {
        return searchIndexRepository.findByEntityTypeAndSearchableTextContainingIgnoreCase(entityType, query);
    }
    
    public SearchIndex indexEntity(SearchIndex searchIndex) {
        return searchIndexRepository.save(searchIndex);
    }
    
    public void removeFromIndex(String entityId) {
        searchIndexRepository.deleteByEntityId(entityId);
    }
    
    @KafkaListener(topics = {"user-events", "post-events"}, groupId = "search-service-group")
    public void handleEvents(String event) {
        // Process events and update search index
    }
}
