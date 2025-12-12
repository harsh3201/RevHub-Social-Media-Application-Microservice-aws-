package com.revhub.userservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("doddakarthikreddy11122@gmail.com");
        message.setTo(to);
        message.setSubject("RevHub - Your OTP Code");
        message.setText("Welcome to RevHub!\n\n" +
                "Your OTP code is: " + otp + "\n\n" +
                "This code will expire in 10 minutes.\n\n" +
                "If you didn't request this code, please ignore this email.\n\n" +
                "Thanks,\nRevHub Team");

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("doddakarthikreddy11122@gmail.com");
        message.setTo(to);
        message.setSubject("RevHub - Password Reset Request");
        message.setText("Hello,\\n\\n" +
                "You requested to reset your password.\\n\\n" +
                "Your password reset OTP is: " + otp + "\\n\\n" +
                "This code will expire in 10 minutes.\\n\\n" +
                "If you didn't request this, please ignore this email and your password will remain unchanged.\\n\\n" +
                "Thanks,\\nRevHub Team");

        mailSender.send(message);
    }
}
