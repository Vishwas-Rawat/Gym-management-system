package com.gymmanagement.usermanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@Async
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ---------------- OTP Email ----------------
    public void sendVerificationEmail(String toEmail, Integer userId, String otpCode) {
        String subject = "Verify your account";
        String verifyUrl = "http://localhost:3000/verify?userId=" + userId + "&otp=" + otpCode;

        String body = "<p>Hello,</p>"
                + "<p>Click the button below to verify your email:</p>"
                + "<a href=\"" + verifyUrl + "\" "
                + "style=\"display:inline-block;padding:10px 20px;margin:10px 0;"
                + "font-size:16px;color:white;background-color:#28a745;"
                + "text-decoration:none;border-radius:5px;\">Verify Email</a>"
                + "<p>If the button doesn’t work, copy this link:</p>"
                + "<p><a href=\"" + verifyUrl + "\">" + verifyUrl + "</a></p>"
                + "<p>Or use this OTP directly: <b>" + otpCode + "</b></p>";

        sendHtmlEmail(toEmail, subject, body);
    }

    // ---------------- Registration Link Email ----------------
    public void sendRegistrationLink(String toEmail, String link) {
        String subject = "Complete your registration";
        String body = "<p>Hello,</p>"
                + "<p>Click the button below to complete your registration:</p>"
                + "<a href=\"" + link + "\" "
                + "style=\"display:inline-block;padding:10px 20px;margin:10px 0;"
                + "font-size:16px;color:white;background-color:#007bff;"
                + "text-decoration:none;border-radius:5px;\">Complete Registration</a>"
                + "<p>If the button doesn't work, copy and paste this link:</p>"
                + "<p><a href=\"" + link + "\">" + link + "</a></p>";

        sendHtmlEmail(toEmail, subject, body);
    }

    // ---------------- Core HTML Email Sender ----------------
    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            System.out.println("Email sent to: " + to); // optional logging
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
