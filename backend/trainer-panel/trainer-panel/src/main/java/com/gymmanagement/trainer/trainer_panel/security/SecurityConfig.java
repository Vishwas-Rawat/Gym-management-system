package com.gymmanagement.trainer.trainer_panel.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Value("${spring.web.cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(org.springframework.security.config.Customizer.withDefaults()) // ✅ Enable CORS
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // Allow OPTIONS requests (CORS preflight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // ✅ CRITICAL FIX

                        // Allow WebSocket handshake
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/debug/**").permitAll() // ✅ DEBUG ENDPOINT

                        // Require authentication for chat REST APIs
                        .requestMatchers("/chat/**").authenticated() // ✅ CHANGED from permitAll to authenticated

                        // Allow Food Search (Global Fallback)
                        .requestMatchers(HttpMethod.GET, "/api/food/search").permitAll()

                        // Allow Workout Search & Dictionary (Global Fallback)
                        .requestMatchers(HttpMethod.GET, "/api/workout/exercise/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/workout/exercise/dictionary").permitAll()

                        // Trainer routes
                        .requestMatchers("/trainer/**").hasAnyRole("TRAINER", "ADMIN")

                        // Workout – GET my-plan → MEMBER or TRAINER
                        .requestMatchers("/api/workout/my-plan").hasAnyRole("MEMBER", "TRAINER")

                        // Member Requests
                        .requestMatchers("/api/member/**").hasRole("MEMBER")

                        // All workout authenticated
                        .requestMatchers("/api/workout/**").authenticated()

                        // Admin Attendance
                        .requestMatchers("/attendance/admin/**").hasRole("ADMIN")

                        .requestMatchers("/attendance/**").authenticated()

                        .requestMatchers("/auth/check-status").authenticated() // Reverted

                        // All other APIs must be authenticated
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
