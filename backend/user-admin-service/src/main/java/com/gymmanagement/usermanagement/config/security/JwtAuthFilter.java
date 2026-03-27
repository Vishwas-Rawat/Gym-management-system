package com.gymmanagement.usermanagement.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.gymmanagement.usermanagement.repository.UserRepository;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // 🔥 SKIP JWT FOR FEIGN + PUBLIC APIs
        if (path.startsWith("/member/active")
                || path.startsWith("/user/email")
                || path.startsWith("/user/internal")
                || path.startsWith("/user/login")
                || path.startsWith("/user/register")
                || path.startsWith("/member/complete-registration")
                || path.startsWith("/trainer/complete-registration")) {

            filterChain.doFilter(request, response);
            return;
        }

        // Normal JWT processing
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);

                if (email != null && jwtUtil.validateToken(token, email)) {

                    if (SecurityContextHolder.getContext().getAuthentication() == null) {

                        var user = userRepository.findByEmail(email)
                                .orElse(null);

                        if (user != null) {
                            var auth = new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));

                            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(auth);
                        }
                    }
                }
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

}
