package com.revhub.postservice.service;

import com.revhub.postservice.dto.CreatePostRequest;
import com.revhub.postservice.dto.PostDTO;
import com.revhub.postservice.model.Post;
import com.revhub.postservice.model.PostVisibility;
import com.revhub.postservice.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    
    private final PostRepository postRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final MentionService mentionService;
    private final CommentService commentService;
    private final RestTemplate restTemplate;
    
    public PostDTO createPost(CreatePostRequest request) {
        Post post = new Post();
        post.setUsername(request.getUsername() != null ? request.getUsername() : "anonymous");
        post.setContent(request.getContent());
        
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            post.setImageUrl(request.getImageUrl());
            if (request.getMediaType() != null && !request.getMediaType().isEmpty()) {
                post.setMediaType(request.getMediaType());
            } else if (request.getImageUrl().startsWith("data:video/")) {
                post.setMediaType("video");
            } else if (request.getImageUrl().startsWith("data:image/")) {
                post.setMediaType("image");
            }
        }
        
        post.setLikesCount(0);
        post.setCommentsCount(0);
        post.setSharesCount(0);
        
        if (request.getVisibility() != null) {
            try {
                PostVisibility visibility = PostVisibility.valueOf(request.getVisibility().toUpperCase());
                post.setVisibility(visibility);
            } catch (IllegalArgumentException e) {
                System.err.println("Invalid visibility value: " + request.getVisibility() + ", defaulting to PUBLIC");
                post.setVisibility(PostVisibility.PUBLIC);
            }
        } else {
            post.setVisibility(PostVisibility.PUBLIC);
        }
        
        post = postRepository.save(post);
        
        kafkaTemplate.send("post-events", "POST_CREATED", post.getId());
        mentionService.processMentions(post.getContent(), post.getUsername(), post.getId());
        
        return toDTO(post);
    }
    
    public PostDTO getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return toDTO(post);
    }
    
    public List<PostDTO> getPostsByUsername(String username) {
        return postRepository.findByUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<PostDTO> getPostsByUsernameEnriched(String username, String currentUser) {
        try {
            return postRepository.findByUsernameOrderByCreatedAtDesc(username)
                    .stream()
                    .map(post -> enrichPostWithLikeStatus(post, currentUser))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error enriching posts: " + e.getMessage());
            return postRepository.findByUsernameOrderByCreatedAtDesc(username)
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }
    }
    
    public List<PostDTO> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public Page<Post> getUniversalPosts(Pageable pageable, String currentUsername) {
        System.out.println("[DISCOVERY FEED] Getting only PUBLIC posts");
        Page<Post> publicPosts = postRepository.findPublicPosts(pageable);
        System.out.println("[DISCOVERY FEED] Returning " + publicPosts.getTotalElements() + " public posts");
        return publicPosts;
    }
    
    public Page<Post> getFollowingFeed(Pageable pageable, String currentUsername) {
        System.out.println("[FOLLOWING FEED] Getting posts from followed users for: " + currentUsername);
        List<String> followingUsernames = getFollowingUsernames(currentUsername);
        
        // Add current user to see their own posts
        if (!followingUsernames.contains(currentUsername)) {
            followingUsernames.add(currentUsername);
        }
        
        System.out.println("[FOLLOWING FEED] User follows (including self): " + followingUsernames);
        
        if (followingUsernames.isEmpty()) {
            System.out.println("[FOLLOWING FEED] No users, returning empty page");
            return Page.empty(pageable);
        }
        
        Page<Post> followingPosts = postRepository.findByUsernameInOrderByCreatedAtDesc(followingUsernames, pageable);
        System.out.println("[FOLLOWING FEED] Returning " + followingPosts.getTotalElements() + " posts");
        return followingPosts;
    }
    
    private List<String> getFollowingUsernames(String username) {
        try {
            String socialServiceHost = System.getenv().getOrDefault("SOCIAL_SERVICE_HOST", "localhost:8083");
            String url = "http://" + socialServiceHost + "/api/social/following/" + username;
            
            @SuppressWarnings("unchecked")
            List<java.util.Map<String, Object>> following = restTemplate.getForObject(url, List.class);
            
            if (following != null) {
                return following.stream()
                    .map(f -> (String) f.get("followingUsername"))
                    .collect(Collectors.toList());
            }
        } catch (Exception e) {
            System.err.println("Error fetching following list: " + e.getMessage());
        }
        return List.of();
    }
    
    public List<Post> searchPosts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        String searchTerm = query.trim().toLowerCase();
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
            .filter(post -> post.getContent().toLowerCase().contains(searchTerm) ||
                           post.getUsername().toLowerCase().contains(searchTerm))
            .collect(Collectors.toList());
    }
    
    public PostDTO updatePost(Long id, CreatePostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        post.setMediaType(request.getMediaType());
        
        if (request.getVisibility() != null) {
            try {
                post.setVisibility(PostVisibility.valueOf(request.getVisibility().toUpperCase()));
            } catch (IllegalArgumentException e) {
                post.setVisibility(PostVisibility.PUBLIC);
            }
        }
        
        post = postRepository.save(post);
        
        kafkaTemplate.send("post-events", "POST_UPDATED", post.getId());
        
        return toDTO(post);
    }
    
    public void deletePost(Long id) {
        postRepository.deleteById(id);
        kafkaTemplate.send("post-events", "POST_DELETED", id);
    }
    
    public void incrementLikes(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikesCount(post.getLikesCount() + 1);
        postRepository.save(post);
    }
    
    public void incrementComments(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setCommentsCount(post.getCommentsCount() + 1);
        postRepository.save(post);
    }
    
    public void incrementShares(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        Integer currentShares = post.getSharesCount() != null ? post.getSharesCount() : 0;
        post.setSharesCount(currentShares + 1);
        postRepository.save(post);
        kafkaTemplate.send("post-events", "POST_SHARED", post.getId());
    }
    
    private PostDTO toDTO(Post post) {
        PostDTO dto = new PostDTO(
            post.getId(),
            post.getUsername(),
            post.getContent(),
            post.getImageUrl(),
            post.getLikesCount(),
            post.getCommentsCount(),
            post.getCreatedAt()
        );
        dto.setMediaType(post.getMediaType());
        dto.setVisibility(post.getVisibility() != null ? post.getVisibility().name() : "PUBLIC");
        dto.setSharesCount(post.getSharesCount());
        return dto;
    }
    
    public List<?> getComments(Long postId) {
        return commentService.getCommentsByPostId(postId);
    }
    
    public Object addComment(Long postId, String content, String username) {
        com.revhub.postservice.dto.CommentRequest request = new com.revhub.postservice.dto.CommentRequest();
        request.setContent(content);
        return commentService.addComment(postId, request, username);
    }
    
    public void deleteComment(Long commentId) {
        commentService.deleteComment(commentId);
    }
    
    public PostDTO enrichPostWithLikeStatus(Post post, String username) {
        PostDTO dto = toDTO(post);
        dto.setIsLiked(false);
        
        // Get actual comment count from database
        List<?> comments = commentService.getCommentsByPostId(post.getId());
        dto.setCommentsCount(comments != null ? comments.size() : 0);
        
        try {
            String socialServiceHost = System.getenv().getOrDefault("SOCIAL_SERVICE_HOST", "localhost:8083");
            String socialServiceUrl = "http://" + socialServiceHost + "/api/social";
            System.out.println("Enriching post " + post.getId() + " for user: " + username + " using URL: " + socialServiceUrl);
            
            // Get actual like count from social service
            @SuppressWarnings("unchecked")
            List<Object> likes = restTemplate.getForObject(
                socialServiceUrl + "/likes/" + post.getId(),
                List.class
            );
            if (likes != null) {
                dto.setLikesCount(likes.size());
                System.out.println("Post " + post.getId() + " has " + likes.size() + " likes");
            }
            
            // Check if current user liked this post
            if (username != null && !username.isEmpty()) {
                Boolean isLiked = restTemplate.getForObject(
                    socialServiceUrl + "/liked/" + post.getId() + "?username=" + username,
                    Boolean.class
                );
                dto.setIsLiked(isLiked != null && isLiked);
                System.out.println("User " + username + " liked post " + post.getId() + ": " + dto.getIsLiked());
            }
        } catch (Exception e) {
            System.err.println("Error enriching post with like status for post " + post.getId() + ": " + e.getMessage());
            e.printStackTrace();
        }
        return dto;
    }
}
