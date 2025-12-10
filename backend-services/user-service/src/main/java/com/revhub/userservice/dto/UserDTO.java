package com.revhub.userservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.ALWAYS)
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String bio;
    private String profilePicture;
    private LocalDateTime createdAt;
    private Integer followersCount;
    private Integer followingCount;
    private Boolean isPrivate;
    
    public UserDTO(Long id, String username, String email, String firstName, String lastName, String bio, String profilePicture, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bio = bio;
        this.profilePicture = profilePicture;
        this.createdAt = createdAt;
        this.followersCount = 0;
        this.followingCount = 0;
    }
}
