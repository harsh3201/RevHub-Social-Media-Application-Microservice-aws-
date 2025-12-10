package com.revhub.socialservice.repository;

import com.revhub.socialservice.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findByPostId(Long postId);
    Optional<Like> findByUsernameAndPostId(String username, Long postId);
    boolean existsByUsernameAndPostId(String username, Long postId);
    void deleteByUsernameAndPostId(String username, Long postId);
}
