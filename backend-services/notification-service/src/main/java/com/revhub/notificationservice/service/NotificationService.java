package com.revhub.notificationservice.service;

import com.revhub.notificationservice.model.Notification;
import com.revhub.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
    
    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalse(userId);
    }
    
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }
    
    public void markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    @KafkaListener(topics = "notification-events", groupId = "notification-service-group")
    public void handleNotificationEvents(Map<String, Object> event) {
        try {
            log.info("Received notification event: {}", event);
            String type = (String) event.get("type");
            
            if ("MENTION".equals(type)) {
                createNotification(
                    (String) event.get("mentionedUsername"),
                    (String) event.get("authorUsername"),
                    "MENTION",
                    event.get("authorUsername") + " mentioned you in a post",
                    event.get("postId")
                );
            } else if ("LIKE".equals(type)) {
                String postAuthor = (String) event.get("postAuthor");
                String liker = (String) event.get("likerUsername");
                if (postAuthor != null && !postAuthor.equals(liker)) {
                    createNotification(
                        postAuthor,
                        liker,
                        "LIKE",
                        liker + " liked your post",
                        event.get("postId")
                    );
                }
            } else if ("COMMENT".equals(type)) {
                String postAuthor = (String) event.get("postAuthor");
                String commenter = (String) event.get("commenterUsername");
                if (postAuthor != null && !postAuthor.equals(commenter)) {
                    createNotification(
                        postAuthor,
                        commenter,
                        "COMMENT",
                        commenter + " commented on your post",
                        event.get("postId")
                    );
                }
            } else if ("FOLLOW".equals(type)) {
                createNotification(
                    (String) event.get("followedUsername"),
                    (String) event.get("followerUsername"),
                    "FOLLOW",
                    event.get("followerUsername") + " started following you",
                    null
                );
            } else if ("MESSAGE".equals(type)) {
                createNotification(
                    (String) event.get("receiverUsername"),
                    (String) event.get("senderUsername"),
                    "MESSAGE",
                    event.get("senderUsername") + " sent you a message",
                    null
                );
            }
        } catch (Exception e) {
            log.error("Error processing notification event: {}", e.getMessage(), e);
        }
    }
    
    private void createNotification(String userId, String fromUserId, String type, String message, Object postId) {
        if (userId == null || fromUserId == null) {
            log.warn("Skipping notification - missing userId or fromUserId");
            return;
        }
        
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setFromUserId(fromUserId);
        notification.setType(type);
        notification.setMessage(message);
        notification.setPostId(postId != null ? postId.toString() : null);
        notification.setRead(false);
        notificationRepository.save(notification);
        log.info("Created {} notification for user: {}", type, userId);
    }
}
