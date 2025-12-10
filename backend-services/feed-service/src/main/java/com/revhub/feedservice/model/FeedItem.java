package com.revhub.feedservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "feed_items")
@Data
public class FeedItem {
    @Id
    private String id;
    private String userId;
    private Long postId;
    private String postUsername;
    private String postContent;
    private String postImageUrl;
    private String mediaType;
    private String visibility;
    private Integer likesCount;
    private Integer commentsCount;
    private Integer sharesCount;
    private LocalDateTime postCreatedAt;
    private Double score;
    private LocalDateTime addedToFeedAt;
    
    public FeedItem() {
        this.addedToFeedAt = LocalDateTime.now();
    }
}
