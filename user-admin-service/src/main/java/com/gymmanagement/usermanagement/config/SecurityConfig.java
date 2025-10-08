package com.gymmanagement.usermanagement.config;

import com.gymmanagement.commonservices.util.JwtAuthFilter;
import com.gymmanagement.commonservices.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);
    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
        logger.info("Initializing SecurityConfig with JwtUtil");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        logger.info("Configuring SecurityFilterChain");
        http
            .csrf(csrf -> {
                csrf.disable();
                logger.info("CSRF protection disabled");
            })
            .cors(cors -> {
                cors.configurationSource(corsConfigurationSource());
                logger.info("CORS configuration applied");
            })
            .sessionManagement(session -> {
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                logger.info("Session management set to STATELESS");
            })
            .authorizeHttpRequests(auth -> {
                auth
                    .requestMatchers("/user/**").permitAll()
                    .requestMatchers("/workout/addExercise").hasRole("ADMIN")   // ✅ changed
                    .requestMatchers("/workout/viewExercise").authenticated()
                    .requestMatchers("/member/**").hasRole("ADMIN")             // ✅ consistent
                    .requestMatchers("/gym/**").hasRole("ADMIN") // only ADMIN can access

                    .anyRequest().permitAll();
                logger.info("Authorization rules configured");
            })
            .addFilterBefore(new JwtAuthFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> {
                ex
                    .authenticationEntryPoint((request, response, authException) -> {
                        logger.debug("Authentication error for request {}: {}", request.getRequestURI(), authException.getMessage());
                        response.setContentType("application/json");
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.getWriter().write("{\"error\": \"Unauthorized: " + authException.getMessage() + "\"}");
                    })
                    .accessDeniedHandler((request, response, accessDeniedException) -> {
                        logger.debug("Access denied for request {}: {}", request.getRequestURI(), accessDeniedException.getMessage());
                        response.setContentType("application/json");
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.getWriter().write("{\"error\": \"Forbidden: " + accessDeniedException.getMessage() + "\"}");
                    });
                logger.info("Custom exception handling configured");
            });

        SecurityFilterChain filterChain = http.build();
        logger.info("SecurityFilterChain built successfully");
        return filterChain;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*"); // allow all origins
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        logger.info("Creating BCryptPasswordEncoder bean");
        return new BCryptPasswordEncoder();
    }
}
