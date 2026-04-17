package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.commonservices.entity.MasterFoodItem;
import com.gymmanagement.trainer.trainer_panel.service.DietLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/food")
@RequiredArgsConstructor
public class FoodDatabaseController {

    private final DietLogService service;
    private final com.gymmanagement.trainer.trainer_panel.repository.MemberRepository memberRepo; // Need repo to
                                                                                                  // resolve
                                                                                                  // userId->memberId

    private Integer getMemberIdOrNull(java.security.Principal principal) {
        if (principal instanceof com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal mp) {
            return memberRepo.findByUser_UserId(mp.userId())
                    .orElseThrow(() -> new IllegalArgumentException("Member not found")).getMemberId();
        }
        return null; // Admin/Trainer has no memberId -> sees only global
    }

    @GetMapping("/search")
    public ResponseEntity<Page<MasterFoodItem>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            java.security.Principal principal) {
        Integer memberId = getMemberIdOrNull(principal);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.searchFood(query, memberId, pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<MasterFoodItem> addFood(@RequestBody MasterFoodItem item, java.security.Principal principal) {
        Integer memberId = getMemberIdOrNull(principal);
        return ResponseEntity.ok(service.addFoodToDatabase(item, memberId));
    }
}
