package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.*;
import com.gymmanagement.commonservices.enumeration.Role;
import com.gymmanagement.commonservices.enumeration.VerificationType;
import com.gymmanagement.commonservices.util.JwtUtil;
import com.gymmanagement.usermanagement.Request.RegisterRequest;
import com.gymmanagement.usermanagement.Response.RegisterResponse;
import com.gymmanagement.usermanagement.Response.LoginResponse;
import com.gymmanagement.usermanagement.exception.OtpException;
import com.gymmanagement.usermanagement.exception.UserAlreadyExistsException;
import com.gymmanagement.usermanagement.repository.*;
import com.gymmanagement.usermanagement.service.EmailService;
import com.gymmanagement.usermanagement.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private UserProfileRepository userProfileRepository;
    @Autowired private UserVerificationRepository userVerificationRepository;
    @Autowired private EmailService emailService;
    @Autowired private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int OTP_VALID_DURATION_MINUTES = 5;
    private static final int OTP_RESEND_INTERVAL_SECONDS = 60;

    // ---------------- User Registration ----------------
    @Override
    @Transactional
    public RegisterResponse registerUser(RegisterRequest request) {
        Role role = Role.ADMIN; // only admin registration allowed

        // Check existing user by email
        Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            if (!existingUser.getIsActive() || !existingUser.getIsEmailVerified()) {
                resendOtp(existingUser.getUserId());
                return new RegisterResponse(
                    "success",
                    "User already registered but not verified. OTP resent.",
                    existingUser.getUserId(),
                    existingUser.getEmail()
                );
            } else {
                throw new UserAlreadyExistsException("Email already registered and verified");
            }
        }

        // Check phone & username
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new UserAlreadyExistsException("Phone number already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already taken");
        }

        // Create Admin User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setUsername(request.getUsername());
        user.setAddress(request.getAddress());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender());
        user.setIsEmailVerified(false);
        user.setIsPhoneVerified(false);
        user.setIsActive(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        user = userRepository.save(user);

        // Create User Profile
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());
        profile.setAddress(request.getAddress());
        profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(profile);

        // Send OTP for email verification
        sendOtp(user);

        return new RegisterResponse(
            "success",
            "Admin registered successfully. OTP sent to your email.",
            user.getUserId(),
            user.getEmail()
        );
    }

    // ---------------- OTP Methods ----------------
    private void sendOtp(User user) {
        List<UserVerification> lastOtps =
                userVerificationRepository.findByUser_UserIdOrderByCreatedAtDesc(user.getUserId());
        if (!lastOtps.isEmpty() &&
            lastOtps.get(0).getCreatedAt().plusSeconds(OTP_RESEND_INTERVAL_SECONDS).isAfter(LocalDateTime.now())) {
            throw new OtpException("OTP was already sent recently. Please wait.");
        }

        String otpCode = generateOtp();
        UserVerification otp = new UserVerification();
        otp.setUser(user);
        otp.setOtpCode(otpCode);
        otp.setType(VerificationType.EMAIL);
        otp.setIsUsed(false);
        otp.setCreatedAt(LocalDateTime.now());
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_VALID_DURATION_MINUTES));
        userVerificationRepository.save(otp);

        emailService.sendVerificationEmail(user.getEmail(), user.getUserId(), otpCode);
    }

    @Override
    public RegisterResponse verifyOtp(Integer userId, String otpCode) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return new RegisterResponse("error", "Invalid user", userId, null);
        }

        Optional<UserVerification> otpOpt =
                userVerificationRepository.findByUser_UserIdAndOtpCodeAndIsUsedFalseAndExpiresAtAfter(
                        userId, otpCode, LocalDateTime.now());

        if (otpOpt.isEmpty()) {
            return new RegisterResponse("error", "Invalid or expired OTP", userId, null);
        }

        UserVerification otp = otpOpt.get();
        otp.setIsUsed(true);
        userVerificationRepository.save(otp);

        User user = userOpt.get();
        user.setIsEmailVerified(true);
        user.setIsActive(true);
        userRepository.save(user);

        return new RegisterResponse("success", "OTP verification successful. Account activated.", userId, user.getEmail());
    }

    @Override
    public RegisterResponse resendOtp(Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return new RegisterResponse("error", "Invalid user", userId, null);
        }

        User user = userOpt.get();
        if (user.getIsActive()) {
            return new RegisterResponse("error", "User already verified", userId, user.getEmail());
        }

        sendOtp(user);
        return new RegisterResponse("success", "OTP resent successfully.", userId, user.getEmail());
    }

    // ---------------- Login ----------------
    @Override
    public LoginResponse login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return new LoginResponse(null, email, null, "Invalid email or password");
        }

        User user = userOpt.get();
        if (!user.getIsActive() || !user.getIsEmailVerified()) {
            return new LoginResponse(user.getUserId(), email, null, "Account not verified. Verify OTP first.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return new LoginResponse(user.getUserId(), email, null, "Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
        return new LoginResponse(user.getUserId(), user.getEmail(), token, "Login successful");
    }

    // ---------------- Utility ----------------
    private String generateOtp() {
        return String.valueOf(100000 + secureRandom.nextInt(900000));
    }
}
