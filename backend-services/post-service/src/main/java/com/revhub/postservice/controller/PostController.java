package com.revhub.postservice.controller;

import com.revhub.postservice.dto.CreatePostRequest;
import com.revhub.postservice.dto.PostDTO;
import com.revhub.postservice.model.Post;
import com.revhub.postservice.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    
    private final PostService postService;
    
    @PostMapping(consumes = "application/json")
    public ResponseEntity<?> createPost(
            @RequestBody CreatePostRequest request,
            @RequestHeader(value = "X-Username", required = false) String username) {
        try {
            if (username != null && !username.isEmpty()) {
                request.setUsername(username);
            }
            return ResponseEntity.ok(postService.createPost(request));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createPostWithFile(
            @RequestPart(value = "content") String content,
            @RequestPart(value = "visibility") String visibility,
            @RequestPart(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @RequestHeader(value = "X-Username", required = false) String username) {
        try {
            CreatePostRequest request = new CreatePostRequest();
            request.setContent(content);
            request.setVisibility(visibility);
            if (username != null && !username.isEmpty()) {
                request.setUsername(username);
            }
            if (file != null && !file.isEmpty()) {
                String base64Image = "data:" + file.getContentType() + ";base64," + 
                    java.util.Base64.getEncoder().encodeToString(file.getBytes());
                request.setImageUrl(base64Image);
            }
            return ResponseEntity.ok(postService.createPost(request));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }
    
    @GetMapping("/user/{username}")
    public ResponseEntity<List<PostDTO>> getPostsByUsername(
            @PathVariable String username,
            @RequestHeader(value = "X-Username", required = false) String currentUser) {
        return ResponseEntity.ok(postService.getPostsByUsernameEnriched(username, currentUser));
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "universal") String feedType,
            @RequestHeader(value = "X-Username", required = false) String username) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Post> posts;
            
            if ("followers".equals(feedType) && username != null) {
                posts = postService.getFollowingFeed(pageable, username);
            } else {
                posts = postService.getUniversalPosts(pageable, username);
            }
            
            // Enrich posts with isLiked status
            List<PostDTO> enrichedPosts = posts.getContent().stream()
                .map(post -> postService.enrichPostWithLikeStatus(post, username))
                .collect(java.util.stream.Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", enrichedPosts);
            response.put("totalElements", posts.getTotalElements());
            response.put("totalPages", posts.getTotalPages());
            response.put("size", posts.getSize());
            response.put("number", posts.getNumber());
            response.put("feedType", feedType);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("content", List.of());
            errorResponse.put("totalElements", 0);
            errorResponse.put("totalPages", 0);
            errorResponse.put("size", 0);
            errorResponse.put("number", 0);
            errorResponse.put("feedType", feedType);
            return ResponseEntity.ok(errorResponse);
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Post>> searchPosts(@RequestParam String query) {
        return ResponseEntity.ok(postService.searchPosts(query));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(@PathVariable Long id, @RequestBody CreatePostRequest request) {
        try {
            return ResponseEntity.ok(postService.updatePost(id, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        try {
            postService.deletePost(id);
            return ResponseEntity.ok("Post deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Long id, @RequestHeader(value = "X-Username", required = false) String username) {
        try {
            postService.incrementLikes(id);
            return ResponseEntity.ok("Post liked");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/{id}/share")
    public ResponseEntity<Map<String, Object>> sharePost(@PathVariable Long id) {
        postService.incrementShares(id);
        PostDTO post = postService.getPostById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("sharesCount", post.getSharesCount());
        return ResponseEntity.ok(response);
    }
}
