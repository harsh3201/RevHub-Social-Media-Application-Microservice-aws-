package com.revhub.searchservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "search_index")
@Data
public class SearchIndex {
    @Id
    private String id;
    private String entityType; // USER, POST
    private String entityId;
    @TextIndexed
    private String searchableText;
    private LocalDateTime indexedAt;
    
    public SearchIndex() {
        this.indexedAt = LocalDateTime.now();
    }
}
