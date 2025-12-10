package com.revhub.notificationservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
public class Notification {
    @Id
    private String id;
    private String userId;
    private String fromUserId;
    private String type; // LIKE, COMMENT, FOLLOW, MENTION
    private String message;
    private String postId;
    private boolean read;
    private LocalDateTime createdAt;
    
    public Notification() {
        this.createdAt = LocalDateTime.now();
        this.read = false;
    }
}
