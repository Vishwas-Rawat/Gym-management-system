package com.gymmanagement.usermanagement.config.security;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Filter to enforce API Rate Limiting using Bucket4j.
 * Identifies clients by their IP address.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    // Maps to store buckets per IP address
    private final Map<String, Bucket> simpleBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> sensitiveBuckets = new ConcurrentHashMap<>();

    // Limits
    private static final int SENSITIVE_LIMIT = 5;      // 5 requests per minute
    private static final int GENERAL_LIMIT = 50;       // 50 requests per minute

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String ip = getClientIP(request);
        String path = request.getRequestURI();

        Bucket bucket;
        if (isSensitivePath(path)) {
            bucket = sensitiveBuckets.computeIfAbsent(ip, k -> createNewBucket(SENSITIVE_LIMIT));
        } else {
            bucket = simpleBuckets.computeIfAbsent(ip, k -> createNewBucket(GENERAL_LIMIT));
        }

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            // Add remaining capacity to headers
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            // Limit exceeded
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.setContentType("application/json");
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));
            response.getWriter().write(String.format(
                "{\"error\": \"Too many requests\", \"retry_after_seconds\": %d, \"message\": \"Please wait before trying again.\"}",
                waitForRefill
            ));
        }
    }

    private boolean isSensitivePath(String path) {
        return path.contains("/login") || 
               path.contains("/verify-otp") || 
               path.contains("/resend-otp") ||
               path.contains("/complete-registration");
    }

    private Bucket createNewBucket(int limit) {
        Bandwidth limitBandwidth = Bandwidth.classic(limit, Refill.intervally(limit, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limitBandwidth)
                .build();
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
