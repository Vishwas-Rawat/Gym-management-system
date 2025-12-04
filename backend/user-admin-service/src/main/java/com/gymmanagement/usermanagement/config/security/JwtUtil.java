// src/main/java/com/gymmanagement/usermanagement/config/security/JwtUtil.java
package com.gymmanagement.usermanagement.config.security;

import com.gymmanagement.usermanagement.repository.BlacklistedTokenRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // CHANGE THIS IN PRODUCTION! Use application.yml + @Value
    private static final String SECRET_KEY = "your-256-bit-secret-here-change-in-prod-12345678901234567890123456789012";

    // 24 hours (adjust as needed)
    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24;

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // ========================= Extract Claims =========================
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Integer extractTrainerId(String token) {
        return extractClaim(token, claims -> claims.get("trainerId", Integer.class));
    }

    public Date extractExpirationDate(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public LocalDateTime extractExpiration(String token) {
        return extractExpirationDate(token)
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    private boolean isTokenExpired(String token) {
        try {
            return extractExpirationDate(token).before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    // ========================= Blacklist Check =========================
    public boolean isTokenBlacklisted(String token) {
        if (token == null || token.isBlank()) return true;
        return blacklistedTokenRepository.existsByToken(token);
    }

    // ========================= Validation =========================
    public boolean validateToken(String token, String email) {
        try {
            if (isTokenBlacklisted(token)) {
                return false;
            }
            String extractedEmail = extractEmail(token);
            return extractedEmail.equals(email) && !isTokenExpired(token);
        } catch (MalformedJwtException e) {
            // Invalid JWT structure
            return false;
        } catch (ExpiredJwtException e) {
            // Token expired
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    // ========================= Generate Token =========================
    public String generateToken(String email, String role, Integer trainerId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        if (trainerId != null) {
            claims.put("trainerId", trainerId);
        }

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}