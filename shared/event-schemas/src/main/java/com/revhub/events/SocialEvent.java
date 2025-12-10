package com.revhub.events;

import java.time.LocalDateTime;

public class SocialEvent {
    private String eventId;
    private String eventType;
    private Long userId;
    private Long targetUserId;
    private String referenceId;
    private LocalDateTime timestamp;

    public SocialEvent() {}

    public SocialEvent(String eventType, Long userId, Long targetUserId) {
        this.eventType = eventType;
        this.userId = userId;
        this.targetUserId = targetUserId;
        this.timestamp = LocalDateTime.now();
    }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getTargetUserId() { return targetUserId; }
    public void setTargetUserId(Long targetUserId) { this.targetUserId = targetUserId; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
