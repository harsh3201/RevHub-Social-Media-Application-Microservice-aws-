package com.revhub.feedservice.client;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostDTO {
    private Long id;
    private String username;
    private String content;
    private String imageUrl;
    private String mediaType;
    private String visibility;
    private Integer likesCount;
    private Integer commentsCount;
    private Integer sharesCount;
    private LocalDateTime createdAt;
}
