package com.revhub.postservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@FeignClient(name = "user-service")
public interface UserServiceClient {
    
    @GetMapping("/api/users/{username}")
    UserDTO getUserByUsername(@PathVariable String username);
    
    @GetMapping("/api/users/search")
    List<UserDTO> searchUsers(@RequestParam String query);
}
