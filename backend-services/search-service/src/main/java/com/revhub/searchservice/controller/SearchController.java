package com.revhub.searchservice.controller;

import com.revhub.searchservice.model.SearchIndex;
import com.revhub.searchservice.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {
    
    private final SearchService searchService;
    
    @GetMapping
    public ResponseEntity<List<SearchIndex>> search(@RequestParam String query) {
        return ResponseEntity.ok(searchService.search(query));
    }
    
    @GetMapping("/{entityType}")
    public ResponseEntity<List<SearchIndex>> searchByType(@PathVariable String entityType, @RequestParam String q) {
        return ResponseEntity.ok(searchService.searchByType(entityType, q));
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<SearchIndex>> searchUsers(@RequestParam String q) {
        return ResponseEntity.ok(searchService.searchByType("user", q));
    }
    
    @GetMapping("/posts")
    public ResponseEntity<List<SearchIndex>> searchPosts(@RequestParam String q) {
        return ResponseEntity.ok(searchService.searchByType("post", q));
    }
    
    @PostMapping("/index")
    public ResponseEntity<SearchIndex> indexEntity(@RequestBody SearchIndex searchIndex) {
        return ResponseEntity.ok(searchService.indexEntity(searchIndex));
    }
    
    @DeleteMapping("/{entityId}")
    public ResponseEntity<Void> removeFromIndex(@PathVariable String entityId) {
        searchService.removeFromIndex(entityId);
        return ResponseEntity.noContent().build();
    }
}
