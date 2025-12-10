package com.revhub.postservice.controller;

import com.revhub.postservice.dto.CommentRequest;
import com.revhub.postservice.model.Comment;
import com.revhub.postservice.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class CommentController {
    
    private final CommentService commentService;

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(commentService.getCommentsByPostId(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long id, 
                                             @RequestBody CommentRequest request,
                                             @RequestHeader(value = "X-Username", required = false) String username) {
        try {
            Comment comment = commentService.addComment(id, request, username);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long postId, 
                                             @PathVariable Long commentId,
                                             @RequestHeader(value = "X-Username", required = false) String username) {
        try {
            commentService.deleteComment(postId, commentId, username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/comments/{commentId}/replies")
    public ResponseEntity<Comment> addReply(@PathVariable Long commentId,
                                           @RequestBody CommentRequest request,
                                           @RequestHeader(value = "X-Username", required = false) String username) {
        try {
            request.setParentCommentId(commentId);
            Comment reply = commentService.addReply(commentId, request, username);
            return ResponseEntity.ok(reply);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
