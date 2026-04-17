package com.gymmanagement.trainer.trainer_panel.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DebugAuthController {

    @GetMapping("/debug/auth")
    public Map<String, Object> getAuthInfo() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> info = new HashMap<>();

        if (auth == null) {
            info.put("status", "No Authentication (Null)");
            return info;
        }

        info.put("principal", auth.getPrincipal());
        info.put("authorities", auth.getAuthorities());
        info.put("name", auth.getName());
        info.put("isAuthenticated", auth.isAuthenticated());

        return info;
    }
}
