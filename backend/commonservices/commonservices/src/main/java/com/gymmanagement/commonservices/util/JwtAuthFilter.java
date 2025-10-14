package com.gymmanagement.commonservices.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);
    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
        logger.info("Initializing JwtAuthFilter with JwtUtil");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
    	logger.debug("=== Incoming Request ===");
    	logger.debug("Request URI: {}", request.getRequestURI());
    	logger.debug("All headers:");
    	request.getHeaderNames().asIterator().forEachRemaining(h ->
    	    logger.debug("Header {} = {}", h, request.getHeader(h))
    	);
        String authHeader = request.getHeader("Authorization");
        logger.debug("Processing request for {} with Authorization header: {}", request.getRequestURI(), authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            logger.debug("Extracted JWT token: {}", token);
            try {
                String email = jwtUtil.extractEmail(token);
                logger.debug("Extracted email: {}", email);
                if (jwtUtil.validateToken(token, email)) {
                    String role = jwtUtil.extractRole(token);
                    logger.debug("Extracted role: {}", role);
                    if (SecurityContextHolder.getContext().getAuthentication() == null) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                        );
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        logger.debug("Set authentication for email: {} with role: ROLE_{}", email, role);
                    } else {
                        logger.debug("SecurityContext already authenticated");
                    }
                } else {
                    logger.warn("Invalid or expired JWT token for email: {}", email);
                }
            } catch (Exception e) {
                logger.error("JWT authentication failed for request {}: {}", request.getRequestURI(), e.getMessage());
            }
        } else {
            logger.debug("No valid Bearer token found for request: {}", request.getRequestURI());
        }
        filterChain.doFilter(request, response);
    }
}