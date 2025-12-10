package com.revhub.chatservice.service;

import com.revhub.chatservice.model.Message;
import com.revhub.chatservice.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    
    private final MessageRepository messageRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    public Message sendMessage(Message message) {
        message = messageRepository.save(message);
        kafkaTemplate.send("chat-events", "MESSAGE_SENT", message);
        
        // Send notification event only if not messaging yourself
        if (!message.getSenderUsername().equals(message.getReceiverUsername())) {
            java.util.Map<String, Object> event = new java.util.HashMap<>();
            event.put("type", "MESSAGE");
            event.put("receiverUsername", message.getReceiverUsername());
            event.put("senderUsername", message.getSenderUsername());
            event.put("messageId", message.getId());
            kafkaTemplate.send("notification-events", event);
        }
        
        return message;
    }
    
    public List<Message> getConversation(String user1, String user2) {
        return messageRepository.findBySenderUsernameAndReceiverUsernameOrReceiverUsernameAndSenderUsernameOrderByTimestampAsc(
            user1, user2, user1, user2);
    }
    
    public List<Message> getUnreadMessages(String username) {
        try {
            return messageRepository.findByReceiverUsernameAndReadFalse(username);
        } catch (Exception e) {
            System.err.println("Error getting unread messages for " + username + ": " + e.getMessage());
            return new java.util.ArrayList<>();
        }
    }
    
    public List<Message> getAllUserMessages(String username) {
        try {
            return messageRepository.findAll().stream()
                .filter(m -> m.getReceiverUsername().equals(username) || m.getSenderUsername().equals(username))
                .sorted((m1, m2) -> m2.getTimestamp().compareTo(m1.getTimestamp()))
                .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting messages for " + username + ": " + e.getMessage());
            return new java.util.ArrayList<>();
        }
    }
    
    public void markAsRead(String messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setRead(true);
        messageRepository.save(message);
    }
    
    public List<String> getChatContacts(String username) {
        try {
            java.util.Map<String, java.time.LocalDateTime> contactLastMessage = new java.util.HashMap<>();
            
            messageRepository.findAll().stream()
                .filter(m -> (m.getSenderUsername() != null && m.getSenderUsername().equals(username)) || 
                            (m.getReceiverUsername() != null && m.getReceiverUsername().equals(username)))
                .forEach(m -> {
                    String contact = m.getSenderUsername() != null && m.getSenderUsername().equals(username) ? 
                                   m.getReceiverUsername() : m.getSenderUsername();
                    if (contact != null && m.getTimestamp() != null) {
                        contactLastMessage.merge(contact, m.getTimestamp(), 
                            (existing, newTime) -> newTime.isAfter(existing) ? newTime : existing);
                    }
                });
            
            return contactLastMessage.entrySet().stream()
                .sorted(java.util.Map.Entry.<String, java.time.LocalDateTime>comparingByValue().reversed())
                .map(java.util.Map.Entry::getKey)
                .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting chat contacts for " + username + ": " + e.getMessage());
            e.printStackTrace();
            return new java.util.ArrayList<>();
        }
    }
}
