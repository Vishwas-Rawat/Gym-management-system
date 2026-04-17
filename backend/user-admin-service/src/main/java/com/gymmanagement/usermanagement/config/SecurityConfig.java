package com.gymmanagement.usermanagement.config;

import com.gymmanagement.usermanagement.config.security.JwtAuthFilter;
import com.gymmanagement.usermanagement.config.security.JwtUtil;
import com.gymmanagement.usermanagement.config.security.RateLimitingFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    private final JwtUtil jwtUtil;
    private final JwtAuthFilter jwtAuthFilter;
    private final RateLimitingFilter rateLimitingFilter;

    @Value("${spring.web.cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        logger.info("Configuring SecurityFilterChain");

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // PUBLIC APIs
                        .requestMatchers("/user/login").permitAll()
                        .requestMatchers("/user/register").permitAll()
                        .requestMatchers("/user/verify-otp").permitAll()
                        .requestMatchers("/user/resend-otp").permitAll()
                        .requestMatchers("/member/active/**").permitAll()

                        // Registration
                        .requestMatchers("/member/complete-registration").permitAll()
                        .requestMatchers("/trainer/complete-registration").permitAll()

                        // ⭐ REQUIRED for Feign Client to work
                        .requestMatchers("/user/email/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/user/plans").permitAll()
                        .requestMatchers("/error").permitAll() // ⭐ FIX — allow Spring error page

                        // Swagger UI & OpenAPI Docs
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // If you want to call without JWT, use:
                        // .requestMatchers("/user/email/**").permitAll()

                        // Admin APIs
                        .requestMatchers("/member/admin/**").hasRole("ADMIN")
                        .requestMatchers("/trainer/admin/**").hasRole("ADMIN")
                        .requestMatchers("/user/plans/**").hasRole("ADMIN")
                        .requestMatchers("/gym/**").hasRole("ADMIN")
                        .requestMatchers("/workout/addExercise").hasRole("ADMIN")

                        // Logged-in users
                        .requestMatchers("/workout/viewExercise").authenticated()

                        // Everything else
                        .anyRequest().authenticated())

                // Rate Limiting Filter (First)
                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)

                // JWT Filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // Error handling
                .exceptionHandling(exHandler -> exHandler
                        .authenticationEntryPoint((req, res, authEx) -> {
                            res.setContentType("application/json");
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.getWriter().write("{\"error\": \"Unauthorized: Please login first\"}");
                        })
                        .accessDeniedHandler((req, res, deniedEx) -> {
                            res.setContentType("application/json");
                            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            res.getWriter().write("{\"error\": \"Forbidden: You do not have permission\"}");
                        }));

        return http.build();
    }

    // CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // Password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
