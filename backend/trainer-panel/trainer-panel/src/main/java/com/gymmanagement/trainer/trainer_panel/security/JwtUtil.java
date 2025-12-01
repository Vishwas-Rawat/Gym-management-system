// src/main/java/com/gymmanagement/trainer/trainer_panel/security/JwtUtil.java
package com.gymmanagement.trainer.trainer_panel.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.function.Function;

@Component
public class JwtUtil {

    // MUST match user-management secret (or both use env/prop in prod)
    private final String SECRET_KEY = "your-256-bit-secret-here-change-in-prod-your-256-bit-secret-here";
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Integer extractTrainerId(String token) {
        // note: JJWT may return Integer or Number depending on serialization
        Object val = extractClaim(token, claims -> claims.get("trainerId"));
        if (val == null) return null;
        if (val instanceof Integer) return (Integer) val;
        if (val instanceof Number) return ((Number) val).intValue();
        try {
            return Integer.valueOf(val.toString());
        } catch (Exception e) {
            return null;
        }
    }
}
