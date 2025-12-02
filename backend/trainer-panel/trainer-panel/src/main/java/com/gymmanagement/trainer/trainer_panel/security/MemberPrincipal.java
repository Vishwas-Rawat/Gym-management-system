package com.gymmanagement.trainer.trainer_panel.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.util.Collection;
import java.util.List;

public class MemberPrincipal implements UserDetails, Principal {

    private final Integer userId;
    private final String email;
    private final String role;

    public MemberPrincipal(Integer userId, String email, String role) {
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    // ⭐ REQUIRED (your controllers use this)
    public Integer userId() {
        return this.userId;
    }

    // ⭐ FIX FOR YOUR BUG
    // Spring Security uses this for Authentication.getName()
    // This MUST return userId
    @Override
    public String getName() {
        return userId != null ? userId.toString() : email;
    }

    // UserDetails implementation
    @Override
    public String getUsername() {
        return email;
    }

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
