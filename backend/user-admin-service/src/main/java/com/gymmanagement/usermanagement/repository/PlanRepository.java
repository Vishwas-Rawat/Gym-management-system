package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.Plan;
import com.gymmanagement.commonservices.entity.Gym;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Integer> {
    List<Plan> findByGymAndIsActiveTrue(Gym gym);
}
