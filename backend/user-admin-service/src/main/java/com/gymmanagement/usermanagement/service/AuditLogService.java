package com.gymmanagement.usermanagement.service;

import com.gymmanagement.commonservices.entity.AuditLog;
import com.gymmanagement.usermanagement.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.gymmanagement.commonservices.entity.User;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void logAction(String action, String entityType, String entityId, String details) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Integer adminId = null;
        String adminEmail = "SYSTEM";

        if (auth != null && auth.getPrincipal() instanceof User user) {
            adminId = user.getUserId();
            adminEmail = user.getEmail();
        }

        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setPerformedByAdminId(adminId != null ? adminId : 0);
        log.setPerformedByAdminEmail(adminEmail);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        
        auditLogRepository.save(log);
    }
}
