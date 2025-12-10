package com.revhub.feedservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "social-service")
public interface SocialServiceClient {
    
    @GetMapping("/api/social/following/{username}")
    List<FollowDTO> getFollowing(@PathVariable String username);
}
