package com.revhub.postservice.service;

import com.revhub.postservice.dto.CommentRequest;
import com.revhub.postservice.model.Comment;
import com.revhub.postservice.model.Post;
import com.revhub.postservice.repository.CommentRepository;
import com.revhub.postservice.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final org.springframework.kafka.core.KafkaTemplate<String, Object> kafkaTemplate;
    private final MentionService mentionService;
    
    public List<Comment> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdAndParentCommentIdIsNullOrderByCreatedAtDesc(postId);
        comments.forEach(comment -> {
            List<Comment> replies = commentRepository.findByParentCommentIdOrderByCreatedAtAsc(comment.getId());
            comment.setReplies(replies);
        });
        return comments;
    }
    
    @Transactional
    public Comment addComment(Long postId, CommentRequest request, String username) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUsername(username != null ? username : "anonymous");
        comment.setPostId(postId);
        if (request.getParentCommentId() != null) {
            comment.setParentCommentId(request.getParentCommentId());
        }
        
        comment = commentRepository.save(comment);
        
        post.setCommentsCount(post.getCommentsCount() + 1);
        postRepository.save(post);
        
        if (!post.getUsername().equals(username)) {
            java.util.Map<String, Object> event = new java.util.HashMap<>();
            event.put("type", "COMMENT");
            event.put("postAuthor", post.getUsername());
            event.put("commenterUsername", username);
            event.put("postId", postId);
            kafkaTemplate.send("notification-events", event);
        }
        
        // Process mentions in comment
        mentionService.processMentions(request.getContent(), username, postId);
        
        return comment;
    }
    
    @Transactional
    public void deleteComment(Long postId, Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!comment.getUsername().equals(username) && !post.getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        
        commentRepository.delete(comment);
        post.setCommentsCount(Math.max(0, post.getCommentsCount() - 1));
        postRepository.save(post);
    }
    
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        commentRepository.delete(comment);
        
        Post post = postRepository.findById(comment.getPostId()).orElse(null);
        if (post != null) {
            post.setCommentsCount(Math.max(0, post.getCommentsCount() - 1));
            postRepository.save(post);
        }
    }
    
    @Transactional
    public Comment addReply(Long parentCommentId, CommentRequest request, String username) {
        Comment parentComment = commentRepository.findById(parentCommentId)
            .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        
        Comment reply = new Comment();
        reply.setContent(request.getContent());
        reply.setUsername(username != null ? username : "anonymous");
        reply.setPostId(parentComment.getPostId());
        reply.setParentCommentId(parentCommentId);
        
        return commentRepository.save(reply);
    }
}
