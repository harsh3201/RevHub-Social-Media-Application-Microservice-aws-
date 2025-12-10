package com.revhub.userservice.service;

import com.revhub.userservice.config.JwtUtil;
import com.revhub.userservice.dto.*;
import com.revhub.userservice.model.User;
import com.revhub.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final RestTemplate restTemplate;
    private final EmailService emailService;
    
    public String register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setIsVerified(false);
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        
        userRepository.save(user);
        
        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
        }
        
        return "OTP sent to your email. Please verify to complete registration.";
    }
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!user.getIsVerified()) {
            throw new RuntimeException("Please verify your email before logging in");
        }
        
        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, toDTO(user));
    }
    
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setBio(user.getBio());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setCreatedAt(user.getCreatedAt());
        
        // Fetch actual counts from social-service
        try {
            String socialServiceHost = System.getenv().getOrDefault("SOCIAL_SERVICE_HOST", "localhost:8083");
            String socialServiceUrl = "http://" + socialServiceHost + "/api/social";
            
            // Get followers count
            Object[] followers = restTemplate.getForObject(
                socialServiceUrl + "/followers/" + username, Object[].class);
            dto.setFollowersCount(followers != null ? followers.length : 0);
            
            // Get following count
            Object[] following = restTemplate.getForObject(
                socialServiceUrl + "/following/" + username, Object[].class);
            dto.setFollowingCount(following != null ? following.length : 0);
        } catch (Exception e) {
            System.err.println("Error fetching social counts for " + username + ": " + e.getMessage());
            dto.setFollowersCount(0);
            dto.setFollowingCount(0);
        }
        
        return dto;
    }
    
    public UserDTO updateProfile(String username, UserDTO userDTO) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setBio(userDTO.getBio());
        user.setProfilePicture(userDTO.getProfilePicture());
        
        user = userRepository.save(user);
        
        // kafkaTemplate.send("user-events", "USER_UPDATED", user.getId());
        
        return toDTO(user);
    }
    
    public UserDTO updateProfileById(Long userId, UserDTO userDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (userDTO.getFirstName() != null) user.setFirstName(userDTO.getFirstName());
        if (userDTO.getLastName() != null) user.setLastName(userDTO.getLastName());
        if (userDTO.getBio() != null) user.setBio(userDTO.getBio());
        if (userDTO.getProfilePicture() != null) user.setProfilePicture(userDTO.getProfilePicture());
        if (userDTO.getIsPrivate() != null) user.setIsPrivate(userDTO.getIsPrivate());
        
        user = userRepository.save(user);
        return toDTO(user);
    }
    
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<UserDTO> searchUsers(String query) {
        String searchTerm = query.toLowerCase();
        return userRepository.findAll().stream()
                .filter(user -> user.getUsername().toLowerCase().contains(searchTerm) ||
                               (user.getEmail() != null && user.getEmail().toLowerCase().contains(searchTerm)) ||
                               (user.getFirstName() != null && user.getFirstName().toLowerCase().contains(searchTerm)) ||
                               (user.getLastName() != null && user.getLastName().toLowerCase().contains(searchTerm)))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public AuthResponse verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getIsVerified()) {
            throw new RuntimeException("Email already verified");
        }
        
        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }
        
        user.setIsVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, toDTO(user));
    }
    
    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getBio(),
            user.getProfilePicture(),
            user.getCreatedAt()
        );
        dto.setIsPrivate(user.getIsPrivate());
        return dto;
    }
}
