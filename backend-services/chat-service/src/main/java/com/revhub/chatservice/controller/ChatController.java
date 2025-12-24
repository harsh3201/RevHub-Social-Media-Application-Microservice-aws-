package com.revhub.chatservice.controller;

import com.revhub.chatservice.model.Message;
import com.revhub.chatservice.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        Message savedMessage = chatService.sendMessage(message);
        messagingTemplate.convertAndSendToUser(message.getReceiverUsername(), "/queue/messages", savedMessage);
        return ResponseEntity.ok(savedMessage);
    }

    @MessageMapping("/chat.send")
    public void sendWebSocketMessage(Message message) {
        Message savedMessage = chatService.sendMessage(message);
        messagingTemplate.convertAndSendToUser(message.getReceiverUsername(), "/queue/messages", savedMessage);
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(@RequestParam String user1, @RequestParam String user2) {
        return ResponseEntity.ok(chatService.getConversation(user1, user2));
    }

    @GetMapping("/unread/{username}")
    public ResponseEntity<List<Message>> getUnreadMessages(@PathVariable String username) {
        return ResponseEntity.ok(chatService.getUnreadMessages(username));
    }

    @PutMapping("/read/{messageId}")
    public ResponseEntity<Void> markAsRead(@PathVariable String messageId) {
        chatService.markAsRead(messageId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/messages/{username}")
    public ResponseEntity<List<Message>> getUserMessages(@PathVariable String username) {
        try {
            List<Message> messages = chatService.getAllUserMessages(username);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            System.err.println("Error in getUserMessages: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<String>> getChatContacts(@RequestParam String username) {
        try {
            List<String> contacts = chatService.getChatContacts(username);
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            System.err.println("Error in getChatContacts: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }
}
