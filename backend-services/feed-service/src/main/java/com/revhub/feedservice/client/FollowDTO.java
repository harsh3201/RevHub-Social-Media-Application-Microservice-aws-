package com.revhub.feedservice.client;

import lombok.Data;

@Data
public class FollowDTO {
    private Long id;
    private String followerUsername;
    private String followingUsername;
}
