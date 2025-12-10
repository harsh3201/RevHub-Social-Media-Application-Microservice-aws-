package com.revhub.feedservice.controller;

import com.revhub.feedservice.model.FeedItem;
import com.revhub.feedservice.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {
    
    private final FeedService feedService;
    
    @GetMapping("/{userId}")
    public ResponseEntity<List<FeedItem>> getUserFeed(@PathVariable String userId) {
        return ResponseEntity.ok(feedService.getUserFeed(userId));
    }
    
    @GetMapping("/{userId}/chronological")
    public ResponseEntity<List<FeedItem>> getChronologicalFeed(@PathVariable String userId) {
        return ResponseEntity.ok(feedService.getChronologicalFeed(userId));
    }
    
    @PostMapping
    public ResponseEntity<FeedItem> addToFeed(@RequestBody FeedItem feedItem) {
        return ResponseEntity.ok(feedService.addToFeed(feedItem));
    }
    
    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> removeFromFeed(@PathVariable Long postId) {
        feedService.removeFromFeed(postId);
        return ResponseEntity.noContent().build();
    }
}
