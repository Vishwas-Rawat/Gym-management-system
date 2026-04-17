package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.commonservices.entity.Plan;
import com.gymmanagement.usermanagement.service.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/plans")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    @GetMapping
    public ResponseEntity<List<Plan>> getPlans(@RequestParam Long gymId) {
        return ResponseEntity.ok(planService.getAllPlansByGym(gymId));
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Plan> createPlan(@RequestBody Plan plan) {
        return ResponseEntity.ok(planService.createPlan(plan));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Plan> updatePlan(@PathVariable Integer id, @RequestBody Plan plan) {
        return ResponseEntity.ok(planService.updatePlan(id, plan));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePlan(@PathVariable Integer id) {
        planService.deactivatePlan(id);
        return ResponseEntity.ok("Plan deactivated successfully");
    }
}
