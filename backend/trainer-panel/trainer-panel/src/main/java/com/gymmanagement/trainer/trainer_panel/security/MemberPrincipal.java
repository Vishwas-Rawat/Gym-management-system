package com.gymmanagement.trainer.trainer_panel.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;

public class MemberPrincipal implements org.springframework.security.core.userdetails.UserDetails {

    private Integer userId;
    private String email;
    private String role;

    public MemberPrincipal(Integer userId, String email, String role) {
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    public Integer userId() { return userId; }
    public String email() { return email; }
    public String role() { return role; }

    // ⭐ MOST IMPORTANT FIX ⭐
    @Override
    public String getUsername() {
        return email; // Spring uses this as auth.getName()
    }

    // Required UserDetails methods
    @Override public String getPassword() { return null; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> "ROLE_MEMBER");
    }
}
