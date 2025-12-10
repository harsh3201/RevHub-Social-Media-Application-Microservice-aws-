package com.revhub.socialservice.service;

import com.revhub.socialservice.model.Follow;
import com.revhub.socialservice.model.Like;
import com.revhub.socialservice.repository.FollowRepository;
import com.revhub.socialservice.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SocialService {
    
    private final FollowRepository followRepository;
    private final LikeRepository likeRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    public Follow followUser(String follower, String following) {
        if (followRepository.existsByFollowerUsernameAndFollowingUsername(follower, following)) {
            return followRepository.findByFollowerUsernameAndFollowingUsername(follower, following).orElse(null);
        }
        Follow follow = new Follow();
        follow.setFollowerUsername(follower);
        follow.setFollowingUsername(following);
        follow = followRepository.save(follow);
        
        sendFollowEventAsync(follow, follower, following);
        
        return follow;
    }
    
    @Async
    private void sendFollowEventAsync(Follow follow, String follower, String following) {
        try {
            kafkaTemplate.send("social-events", "USER_FOLLOWED", follow);
            
            java.util.Map<String, Object> event = new java.util.HashMap<>();
            event.put("type", "FOLLOW");
            event.put("followedUsername", following);
            event.put("followerUsername", follower);
            kafkaTemplate.send("notification-events", event);
        } catch (Exception e) {
            log.error("Failed to send follow event to Kafka: {}", e.getMessage());
        }
    }
    
    @Transactional
    public void unfollowUser(String follower, String following) {
        Follow follow = followRepository.findByFollowerUsernameAndFollowingUsername(follower, following)
                .orElseThrow(() -> new RuntimeException("Not following"));
        followRepository.delete(follow);
        sendUnfollowEventAsync(follow);
    }
    
    @Async
    private void sendUnfollowEventAsync(Follow follow) {
        try {
            kafkaTemplate.send("social-events", "USER_UNFOLLOWED", follow);
        } catch (Exception e) {
            log.error("Failed to send unfollow event to Kafka: {}", e.getMessage());
        }
    }
    
    public List<Follow> getFollowers(String username) {
        return followRepository.findByFollowingUsername(username);
    }
    
    public List<Follow> getFollowing(String username) {
        return followRepository.findByFollowerUsername(username);
    }
    
    public Like likePost(String username, Long postId, String postAuthor) {
        try {
            if (likeRepository.existsByUsernameAndPostId(username, postId)) {
                return null;
            }
            Like like = new Like();
            like.setUsername(username);
            like.setPostId(postId);
            like = likeRepository.save(like);
            
            sendLikeEventAsync(like, username, postId, postAuthor);
            
            return like;
        } catch (Exception e) {
            log.error("Error liking post: {}", e.getMessage());
            return null;
        }
    }
    
    @Async
    private void sendLikeEventAsync(Like like, String username, Long postId, String postAuthor) {
        try {
            kafkaTemplate.send("social-events", "POST_LIKED", like);
            
            // Only send notification if liking someone else's post
            if (postAuthor != null && !postAuthor.equals(username)) {
                java.util.Map<String, Object> event = new java.util.HashMap<>();
                event.put("type", "LIKE");
                event.put("postAuthor", postAuthor);
                event.put("likerUsername", username);
                event.put("postId", postId);
                kafkaTemplate.send("notification-events", event);
            }
        } catch (Exception e) {
            log.error("Failed to send like event to Kafka: {}", e.getMessage());
        }
    }
    
    @Transactional
    public void unlikePost(String username, Long postId) {
        likeRepository.deleteByUsernameAndPostId(username, postId);
        sendUnlikeEventAsync(postId);
    }
    
    @Async
    private void sendUnlikeEventAsync(Long postId) {
        try {
            kafkaTemplate.send("social-events", "POST_UNLIKED", postId);
        } catch (Exception e) {
            log.error("Failed to send unlike event to Kafka: {}", e.getMessage());
        }
    }
    
    public List<Like> getPostLikes(Long postId) {
        return likeRepository.findByPostId(postId);
    }
    
    public boolean hasLiked(String username, Long postId) {
        return likeRepository.existsByUsernameAndPostId(username, postId);
    }
}
