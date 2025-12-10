package com.revhub.chatservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Document(collection = "messages")
@Data
public class Message {
    @Id
    private String id;
    private String senderUsername;
    private String receiverUsername;
    private String content;
    private LocalDateTime timestamp;
    private boolean read;
    
    public Message() {
        this.timestamp = ZonedDateTime.now(ZoneId.of("Asia/Kolkata")).toLocalDateTime();
        this.read = false;
    }
}
