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

    @Value("${spring.mail.username}")
    private String mailFrom;

    // 1. Send OTP Verification Email
    public void sendVerificationEmail(String toEmail, Integer userId, String otpCode) {
        String subject = "Verify your account";
        String verifyUrl = frontendUrl + "/verify?userId=" + userId + "&otp=" + otpCode;

        Context context = new Context();
        context.setVariable("otp", otpCode);
        context.setVariable("verifyUrl", verifyUrl);

        String htmlBody = templateEngine.process("email/otp-verification.html", context);
        sendHtmlEmail(toEmail, subject, htmlBody);
    }

    // 1.1 Send Forgot Password OTP Email
    public void sendForgotPasswordEmail(String toEmail, String otpCode) {
        String subject = "Password Reset Request";

        Context context = new Context();
        context.setVariable("otp", otpCode);

        String htmlBody = templateEngine.process("email/forgot-password.html", context);
        sendHtmlEmail(toEmail, subject, htmlBody);
    }

    // 2. Send Registration Link (for Admin-added members/trainers)
    public void sendRegistrationLink(String toEmail, String link) {
        String subject = "Complete Your Gym Registration";

        Context context = new Context();
        context.setVariable("link", link);

        String htmlBody = templateEngine.process("email/registration-invite.html", context);
        sendHtmlEmail(toEmail, subject, htmlBody);
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
        System.out.println("DEBUG: Preparing to send email to: " + to + " | Subject: " + subject);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = is HTML

            mailSender.send(message);
            System.out.println("✅ SUCCESS: Email sent to: " + to);
        } catch (jakarta.mail.AuthenticationFailedException e) {
            System.err.println("❌ AUTHENTICATION FAILURE: Check your Gmail App Password! Target: " + to);
            System.err.println("DETAILS: " + e.getMessage());
        } catch (MessagingException e) {
            System.err.println("❌ MESSAGING ERROR: Failed to build or send email to: " + to);
            System.err.println("DETAILS: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ UNEXPECTED EMAIL FAILURE to: " + to);
            System.err.println("TYPE: " + e.getClass().getName());
            System.err.println("MESSAGE: " + e.getMessage());
            e.printStackTrace();
        }
    }
}