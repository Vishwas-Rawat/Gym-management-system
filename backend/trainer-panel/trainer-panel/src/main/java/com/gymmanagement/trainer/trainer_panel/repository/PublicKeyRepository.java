package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.PublicKeyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PublicKeyRepository extends JpaRepository<PublicKeyEntity, Long> {
    Optional<PublicKeyEntity> findByUserId(Integer userId);
}
