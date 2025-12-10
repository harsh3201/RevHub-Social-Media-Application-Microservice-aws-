package com.revhub.userservice.controller;

import com.revhub.userservice.dto.*;
import com.revhub.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String message = userService.register(request);
            return ResponseEntity.ok(java.util.Map.of("message", message));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }
    
    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }
    
    @PutMapping("/{username}")
    public ResponseEntity<UserDTO> updateProfile(@PathVariable String username, @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateProfile(username, userDTO));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateCurrentUserProfile(@RequestHeader(value = "X-User-Id", required = false) String userId, @RequestBody UserDTO userDTO) {
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(userService.updateProfileById(Long.parseLong(userId), userDTO));
    }
    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(userService.searchUsers(search));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("User Service is working!");
    }
}
