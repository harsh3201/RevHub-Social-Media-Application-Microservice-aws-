package com.revhub.searchservice.repository;

import com.revhub.searchservice.model.SearchIndex;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SearchIndexRepository extends MongoRepository<SearchIndex, String> {
    List<SearchIndex> findBySearchableTextContainingIgnoreCase(String query);
    List<SearchIndex> findByEntityTypeAndSearchableTextContainingIgnoreCase(String entityType, String query);
    void deleteByEntityId(String entityId);
}
