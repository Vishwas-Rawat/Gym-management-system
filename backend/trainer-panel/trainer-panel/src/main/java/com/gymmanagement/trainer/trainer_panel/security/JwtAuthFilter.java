package com.gymmanagement.trainer.trainer_panel.security;

import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;
import com.gymmanagement.trainer.trainer_panel.dto.UserResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserManagementClient userClient;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String auth = request.getHeader("Authorization");

        if (request.getRequestURI().startsWith("/actuator") ||
                request.getMethod().equalsIgnoreCase("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (auth != null && auth.startsWith("Bearer ")) {
            System.out.println("Processing Token: " + auth.substring(7, 15) + "...");

            String token = auth.substring(7);

            try {
                System.out.println("DEBUG: JwtAuthFilter - Extracting email...");
                String email = jwtUtil.extractEmail(token);
                System.out.println("DEBUG: JwtAuthFilter - Extracted email: " + email);

                System.out.println("DEBUG: JwtAuthFilter - Extracting role...");
                String role = jwtUtil.extractRole(token);
                System.out.println("DEBUG: JwtAuthFilter - Extracted role: " + role);

                if (email != null && role != null) {

                    System.out.println("DEBUG: JwtAuthFilter - Fetching user from UserClient...");
                    // Fetch user from user service
                    UserResponse user = userClient.getUserByEmail(email);
                    System.out.println("DEBUG: JwtAuthFilter - UserClient returned: "
                            + (user != null ? user.getUserId() : "null"));

                    if (user == null) {
                        System.out.println("ERROR: JwtAuthFilter - User not found for email: " + email);
                        return;
                    } else {
                        System.out.println("DEBUG: JwtAuthFilter - User found: " + user.getUserId());
                    }

                    // TRAINER LOGIN
                    if (role.equalsIgnoreCase("TRAINER")) {
                        System.out.println("DEBUG: JwtAuthFilter - Role is TRAINER");
                        Integer trainerId = jwtUtil.extractTrainerId(token);
                        System.out.println("DEBUG: JwtAuthFilter - Extracted trainerId: " + trainerId);

                        TrainerPrincipal principal = new TrainerPrincipal(
                                user.getUserId(), // safe now
                                trainerId,
                                email,
                                role);

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                        "ROLE_TRAINER")));

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        System.out.println("DEBUG: JwtAuthFilter - Set Authentication for TRAINER");
                    }

                    // MEMBER LOGIN
                    else if (role.equalsIgnoreCase("MEMBER")) {
                        System.out.println("DEBUG: JwtAuthFilter - Role is MEMBER");
                        // Create a simple principal
                        MemberPrincipal principal = new MemberPrincipal(
                                user.getUserId(), // safe now
                                email,
                                role);

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                        "ROLE_MEMBER")));

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        System.out.println("DEBUG: JwtAuthFilter - Set Authentication for MEMBER");
                    }

                    // ADMIN LOGIN (✅ NEW)
                    else if (role.equalsIgnoreCase("ADMIN")) {
                        System.out.println("DEBUG: JwtAuthFilter - Role is ADMIN");
                        AdminPrincipal principal = new AdminPrincipal(
                                user.getUserId(), // safe now
                                email,
                                role);

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                        "ROLE_ADMIN")));

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        System.out.println("DEBUG: JwtAuthFilter - Set Authentication for ADMIN");
                    }
                }

            } catch (Throwable e) {
                System.out.println("❌ JWT AUTH FAILED CRITICALLY: " + e.getMessage());
                e.printStackTrace(); // Print full stack trace for debugging
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
