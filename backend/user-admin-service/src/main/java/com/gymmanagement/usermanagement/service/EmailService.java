package com.gymmanagement.usermanagement.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@Async
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    // 1. Send OTP Verification Email
    public void sendVerificationEmail(String toEmail, Integer userId, String otpCode) {
        String subject = "Verify your account";
        String verifyUrl = frontendUrl + "/verify?userId=" + userId + "&otp=" + otpCode;

        String body = """
                <p>Hello,</p>
                <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
                <div style="text-align:center; margin:30px 0;">
                    <a href="%s" style="display:inline-block; padding:14px 32px; font-size:16px; color:white; background-color:#28a745; text-decoration:none; border-radius:8px; font-weight:bold;">
                        Verify Email Address
                    </a>
                </div>
                <p>If the button doesn't work, copy and paste this link:</p>
                <p><a href="%s">%s</a></p>
                <p>Or use this OTP directly: <strong style="font-size:18px; color:#d32f2f;">%s</strong></p>
                <p>This OTP expires in 10 minutes.</p>
                """
                .formatted(verifyUrl, verifyUrl, verifyUrl, otpCode);

        sendHtmlEmail(toEmail, subject, body);
    }

    // 2. Send Registration Link (for Admin-added members/trainers)
    public void sendRegistrationLink(String toEmail, String link) {
        String subject = "Complete Your Gym Registration";

        String body = """
                <p>Hello,</p>
                <p>Welcome to the gym! Your account has been created. Please complete your registration by setting your password.</p>
                <div style="text-align:center; margin:30px 0;">
                    <a href="%s" style="display:inline-block; padding:14px 32px; font-size:16px; color:white; background-color:#007bff; text-decoration:none; border-radius:8px; font-weight:bold;">
                        Complete Registration
                    </a>
                </div>
                <p>If the button doesn't work, please copy and paste this link into your browser:</p>
                <p><a href="%s">%s</a></p>
                <p>This link expires in 24 hours.</p>
                """
                .formatted(link, link, link);

        sendHtmlEmail(toEmail, subject, body);
    }

    // 3. Send Membership Expiry Reminder (Uses Thymeleaf Templates)
    public void sendMembershipExpiryEmail(String toEmail, String name, LocalDate expiryDate, long daysRemaining) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("expiryDate", expiryDate.format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
        context.setVariable("daysRemaining", Math.abs(daysRemaining));
        context.setVariable("isExpired", daysRemaining < 0);

        String templateName = daysRemaining >= 0 ? "email/expiry-soon.html" : "email/membership-expired.html";
        String subject = daysRemaining >= 0
                ? "Your Membership Expires in " + Math.abs(daysRemaining) + " Day(s)!"
                : "Your Membership Has Expired!";

        String htmlBody = templateEngine.process(templateName, context);
        sendHtmlEmail(toEmail, subject, htmlBody);
    }

    // 4. Core HTML Email Sender
    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = is HTML

            mailSender.send(message);
            System.out.println("Email successfully sent to: " + to);
        } catch (MessagingException e) {
            System.err.println("Failed to send email to: " + to);
            throw new RuntimeException("Could not send email: " + e.getMessage(), e);
        }
    }
}