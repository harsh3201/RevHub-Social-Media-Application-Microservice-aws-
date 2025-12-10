package com.revhub.events;

import java.time.LocalDateTime;

public class PostEvent {
    private String eventId;
    private String eventType;
    private String postId;
    private Long userId;
    private String content;
    private LocalDateTime timestamp;

    public PostEvent() {}

    public PostEvent(String eventType, String postId, Long userId) {
        this.eventType = eventType;
        this.postId = postId;
        this.userId = userId;
        this.timestamp = LocalDateTime.now();
    }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
