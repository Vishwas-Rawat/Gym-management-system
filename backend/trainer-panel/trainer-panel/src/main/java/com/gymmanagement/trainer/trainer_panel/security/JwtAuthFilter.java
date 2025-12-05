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
            String token = auth.substring(7);

            try {
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);

                if (email != null && role != null) {

                    // Fetch user from user service
                    UserResponse user = userClient.getUserByEmail(email);

                    // TRAINER LOGIN
                    if (role.equalsIgnoreCase("TRAINER")) {

                        Integer trainerId = jwtUtil.extractTrainerId(token);

                        TrainerPrincipal principal = new TrainerPrincipal(
                                user != null ? user.getUserId() : null,
                                trainerId,
                                email,
                                role);

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                List.of(() -> "ROLE_TRAINER"));

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }

                    // MEMBER LOGIN
                    else if (role.equalsIgnoreCase("MEMBER")) {

                        // Create a simple principal
                        MemberPrincipal principal = new MemberPrincipal(
                                user != null ? user.getUserId() : null,
                                email,
                                role);

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                List.of(() -> "ROLE_MEMBER"));

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }

                    // ADMIN LOGIN
                    else if (role.equalsIgnoreCase("ADMIN")) {
                        AdminPrincipal principal = new AdminPrincipal(
                                user != null ? user.getUserId() : null,
                                email,
                                role);

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                List.of(() -> "ROLE_ADMIN"));

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }

            } catch (Exception e) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
