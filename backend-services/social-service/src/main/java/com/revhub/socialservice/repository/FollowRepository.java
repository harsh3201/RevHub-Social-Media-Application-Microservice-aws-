package com.revhub.socialservice.repository;

import com.revhub.socialservice.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    List<Follow> findByFollowerUsername(String followerUsername);
    List<Follow> findByFollowingUsername(String followingUsername);
    Optional<Follow> findByFollowerUsernameAndFollowingUsername(String follower, String following);
    boolean existsByFollowerUsernameAndFollowingUsername(String follower, String following);
}
