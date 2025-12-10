package com.revhub.postservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreatePostRequest {
    private String username;
    private String content;
    private String imageUrl;
    private String mediaType;
    private String visibility;
    private List<String> hashtags;
    private List<String> mentions;
}
