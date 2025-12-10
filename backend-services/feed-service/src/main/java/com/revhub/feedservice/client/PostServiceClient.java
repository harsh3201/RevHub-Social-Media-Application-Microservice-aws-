package com.revhub.feedservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "post-service")
public interface PostServiceClient {
    
    @GetMapping("/api/posts/{id}")
    PostDTO getPostById(@PathVariable Long id);
    
    @GetMapping("/api/posts/user/{username}")
    List<PostDTO> getPostsByUsername(@PathVariable String username);
}
