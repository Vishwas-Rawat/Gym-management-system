package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.*;
import com.gymmanagement.commonservices.enumeration.Role;
import com.gymmanagement.usermanagement.Request.RegisterRequest;
import com.gymmanagement.usermanagement.Response.LoginResponse;
import com.gymmanagement.usermanagement.Response.RegisterResponse;
import com.gymmanagement.usermanagement.config.security.JwtUtil;
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
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private UserProfileRepository userProfileRepository;
    @Autowired private UserVerificationRepository userVerificationRepository;
    @Autowired private TrainerRepository trainerRepository;
    @Autowired private EmailService emailService;
    @Autowired private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int OTP_VALID_DURATION_MINUTES = 5;
    private static final int OTP_RESEND_INTERVAL_SECONDS = 60;

    // ============================================================
    //  REGISTER USER
    // ============================================================
    @Override
    @Transactional
    public RegisterResponse registerUser(RegisterRequest request) {

        Role role = Role.ADMIN; // default for your app (you can modify)

        Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            if (Boolean.TRUE.equals(existingUser.getIsActive()) &&
                Boolean.TRUE.equals(existingUser.getIsEmailVerified())) {

                throw new UserAlreadyExistsException("Email already registered and verified");
            } else {
                resendOtp(existingUser.getUserId());
                return new RegisterResponse(
                        "success",
                        "You already started registration. A new OTP has been sent.",
                        existingUser.getUserId(),
                        existingUser.getEmail()
                );
            }
        }

        if (request.getPhoneNumber() != null &&
                userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new UserAlreadyExistsException("Phone number already registered");
        }

        if (request.getUsername() != null &&
                userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already taken");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setIsActive(false);
        user.setIsEmailVerified(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);

        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());
        profile.setAddress(request.getAddress());
        userProfileRepository.save(profile);

        sendOtp(user);

        return new RegisterResponse(
                "success",
                "Registration successful. Please check your email for OTP.",
                user.getUserId(),
                user.getEmail()
        );
    }


    // ============================================================
    //  SEND OTP
    // ============================================================
    private void sendOtp(User user) {

        userVerificationRepository.findTopByUser_UserIdOrderByCreatedAtDesc(user.getUserId())
                .ifPresent(last -> {
                    if (last.getCreatedAt().plusSeconds(OTP_RESEND_INTERVAL_SECONDS)
                            .isAfter(LocalDateTime.now())) {
                        throw new OtpException("Please wait before requesting a new OTP.");
                    }
                });

        String otpCode = generateOtp();

        UserVerification verification = new UserVerification();
        verification.setUser(user);
        verification.setOtpCode(otpCode);
        verification.setIsUsed(false);
        verification.setCreatedAt(LocalDateTime.now());
        verification.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_VALID_DURATION_MINUTES));

        userVerificationRepository.save(verification);

        emailService.sendVerificationEmail(user.getEmail(), user.getUserId(), otpCode);
    }

    // ============================================================
    //  VERIFY OTP
    // ============================================================
    @Override
    public RegisterResponse verifyOtp(Integer userId, String otpCode) {

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return new RegisterResponse("error", "Invalid user", userId, null);
        }

        Optional<UserVerification> otpOpt =
                userVerificationRepository.findByUser_UserIdAndOtpCodeAndIsUsedFalseAndExpiresAtAfter(
                        userId, otpCode, LocalDateTime.now()
                );

        if (otpOpt.isEmpty()) {
            return new RegisterResponse("error", "Invalid or expired OTP", userId, null);
        }

        UserVerification verification = otpOpt.get();
        verification.setIsUsed(true);
        userVerificationRepository.save(verification);

        User user = userOpt.get();
        user.setIsEmailVerified(true);
        user.setIsActive(true);
        userRepository.save(user);

        return new RegisterResponse(
                "success",
                "Account activated successfully!",
                userId,
                user.getEmail()
        );
    }

    @Override
    public RegisterResponse resendOtp(Integer userId) {

        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return new RegisterResponse("error", "User not found", userId, null);
        }

        User user = userOpt.get();

        if (Boolean.TRUE.equals(user.getIsEmailVerified())) {
            return new RegisterResponse("error", "Account already verified", userId, user.getEmail());
        }

        sendOtp(user);

        return new RegisterResponse(
                "success",
                "New OTP sent!",
                userId,
                user.getEmail()
        );
    }


    // ============================================================
    //  LOGIN + JWT WITH TRAINER ID
    // ============================================================
    @Override
    public LoginResponse login(String identifier, String password) {

        if (identifier == null || identifier.isBlank()) {
            return new LoginResponse(null, null, null, "Email or username is required");
        }

        Optional<User> userOpt = userRepository.findByEmail(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(identifier);
        }
        if (userOpt.isEmpty()) {
            return new LoginResponse(null, identifier, null, "Invalid email/username");
        }

        User user = userOpt.get();

        if (!Boolean.TRUE.equals(user.getIsActive()) ||
            !Boolean.TRUE.equals(user.getIsEmailVerified())) {
            return new LoginResponse(
                    user.getUserId(),
                    user.getEmail(),
                    null,
                    "You are not registered"
            );
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return new LoginResponse(user.getUserId(), user.getEmail(), null, "Incorrect password");
        }

        // 🔥 NEW: ADD trainerId inside JWT for TRAINER role
        Integer trainerId = null;

        if (user.getRole() == Role.TRAINER) {
            trainerId = trainerRepository.findByUser_UserId(user.getUserId())
                    .map(Trainer::getTrainerId)
                    .orElse(null);
        }

        // Generate Token
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                trainerId        // ⭐ trainerId embedded in JWT
        );

        return new LoginResponse(
                user.getUserId(),
                user.getEmail(),
                token,
                "Login successful"
        );
    }


    private String generateOtp() {
        return String.format("%06d", 100000 + secureRandom.nextInt(900000));
    }
}
