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

@Configuration
@EnableWebSecurity
@EnableMethodSecurity      // Enables @PreAuthorize
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                    // Allow default Spring error
                    .requestMatchers("/error").permitAll()

                    // Trainer-only endpoints
                    .requestMatchers("/trainer/**").hasRole("TRAINER")

                    // Workout – GET my-plan → MEMBER or TRAINER
                    .requestMatchers("/api/workout/my-plan").hasAnyRole("MEMBER", "TRAINER")

                    // Other workout APIs must be authenticated
                    .requestMatchers("/api/workout/**").authenticated()

                    // All other APIs must be authenticated
                    .anyRequest().authenticated()
            )
            // Add JWT filter before Username/Password filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
