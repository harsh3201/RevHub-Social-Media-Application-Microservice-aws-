package com.revhub.socialservice.controller;

import com.revhub.socialservice.model.Follow;
import com.revhub.socialservice.model.Like;
import com.revhub.socialservice.service.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class SocialController {
    
    private final SocialService socialService;
    
    @PostMapping("/follow/{following}")
    public ResponseEntity<Follow> followUser(@RequestParam String follower, @PathVariable String following) {
        return ResponseEntity.ok(socialService.followUser(follower, following));
    }
    
    @DeleteMapping("/unfollow/{following}")
    public ResponseEntity<Void> unfollowUser(@RequestParam String follower, @PathVariable String following) {
        socialService.unfollowUser(follower, following);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/followers/{username}")
    public ResponseEntity<List<Follow>> getFollowers(@PathVariable String username) {
        return ResponseEntity.ok(socialService.getFollowers(username));
    }
    
    @GetMapping("/following/{username}")
    public ResponseEntity<List<Follow>> getFollowing(@PathVariable String username) {
        return ResponseEntity.ok(socialService.getFollowing(username));
    }
    
    @PostMapping("/like/{postId}")
    public ResponseEntity<Like> likePost(@RequestParam String username, @PathVariable Long postId, @RequestParam(required = false) String postAuthor) {
        try {
            Like like = socialService.likePost(username, postId, postAuthor);
            return like != null ? ResponseEntity.ok(like) : ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.ok().build();
        }
    }
    
    @DeleteMapping("/unlike/{postId}")
    public ResponseEntity<Void> unlikePost(@RequestParam String username, @PathVariable Long postId) {
        socialService.unlikePost(username, postId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/likes/{postId}")
    public ResponseEntity<List<Like>> getPostLikes(@PathVariable Long postId) {
        return ResponseEntity.ok(socialService.getPostLikes(postId));
    }
    
    @GetMapping("/liked/{postId}")
    public ResponseEntity<Boolean> hasLiked(@RequestParam String username, @PathVariable Long postId) {
        return ResponseEntity.ok(socialService.hasLiked(username, postId));
    }
    
    @PostMapping("/toggle-like/{postId}")
    public ResponseEntity<?> toggleLike(@RequestParam String username, @PathVariable Long postId, @RequestParam(required = false) String postAuthor) {
        boolean isLiked = socialService.hasLiked(username, postId);
        int currentCount = socialService.getPostLikes(postId).size();
        
        if (isLiked) {
            socialService.unlikePost(username, postId);
            return ResponseEntity.ok(java.util.Map.of("isLiked", false, "likesCount", Math.max(0, currentCount - 1)));
        } else {
            socialService.likePost(username, postId, postAuthor);
            return ResponseEntity.ok(java.util.Map.of("isLiked", true, "likesCount", currentCount + 1));
        }
    }
}
