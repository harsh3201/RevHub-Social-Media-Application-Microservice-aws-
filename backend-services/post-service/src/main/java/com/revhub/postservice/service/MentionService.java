package com.revhub.postservice.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.HashSet;
import java.util.Set;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MentionService {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    public void processMentions(String content, String authorUsername, Long postId) {
        if (content == null || content.trim().isEmpty()) {
            return;
        }
        
        Pattern pattern = Pattern.compile("@([a-zA-Z0-9_]+)");
        Matcher matcher = pattern.matcher(content);
        Set<String> processedUsers = new HashSet<>();
        
        while (matcher.find()) {
            String mentionedUsername = matcher.group(1);
            
            if (processedUsers.contains(mentionedUsername) || 
                mentionedUsername.equals(authorUsername)) {
                continue;
            }
            
            processedUsers.add(mentionedUsername);
            
            Map<String, Object> mentionEvent = new HashMap<>();
            mentionEvent.put("type", "MENTION");
            mentionEvent.put("mentionedUsername", mentionedUsername);
            mentionEvent.put("authorUsername", authorUsername);
            mentionEvent.put("postId", postId);
            mentionEvent.put("content", content);
            
            kafkaTemplate.send("notification-events", mentionEvent);
        }
    }
}
