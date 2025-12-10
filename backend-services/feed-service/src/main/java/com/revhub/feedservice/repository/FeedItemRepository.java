package com.revhub.feedservice.repository;

import com.revhub.feedservice.model.FeedItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FeedItemRepository extends MongoRepository<FeedItem, String> {
    List<FeedItem> findByUserIdOrderByScoreDescAddedToFeedAtDesc(String userId);
    List<FeedItem> findByUserIdOrderByAddedToFeedAtDesc(String userId);
    void deleteByPostId(Long postId);
}
