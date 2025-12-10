package com.revhub.feedservice.service;

import com.revhub.feedservice.model.FeedItem;
import com.revhub.feedservice.repository.FeedItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedService {
    
    private final FeedItemRepository feedItemRepository;
    
    public List<FeedItem> getUserFeed(String userId) {
        return feedItemRepository.findByUserIdOrderByScoreDescAddedToFeedAtDesc(userId);
    }
    
    public List<FeedItem> getChronologicalFeed(String userId) {
        return feedItemRepository.findByUserIdOrderByAddedToFeedAtDesc(userId);
    }
    
    public FeedItem addToFeed(FeedItem feedItem) {
        feedItem.setScore(calculateScore(feedItem));
        return feedItemRepository.save(feedItem);
    }
    
    public void removeFromFeed(Long postId) {
        feedItemRepository.deleteByPostId(postId);
    }
    
    private Double calculateScore(FeedItem item) {
        int likes = item.getLikesCount() != null ? item.getLikesCount() : 0;
        int comments = item.getCommentsCount() != null ? item.getCommentsCount() : 0;
        int shares = item.getSharesCount() != null ? item.getSharesCount() : 0;
        
        double engagementScore = (likes * 1) + (comments * 2) + (shares * 3);
        
        // Time decay
        long hoursOld = java.time.Duration.between(item.getPostCreatedAt(), java.time.LocalDateTime.now()).toHours();
        double timeDecay = Math.max(0.1, 1.0 - (hoursOld / 168.0));
        
        return engagementScore * timeDecay;
    }
    
    @KafkaListener(topics = "post-events", groupId = "feed-service-group")
    public void handlePostEvents(String event) {
        // Process post events and update feed
    }
}
