package com.gymmanagement.exercise.exercise_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
        "com.gymmanagement.exercise.exercise_management", // local controllers/services
        "com.gymmanagement.commonservices"                // shared module beans
})
@EntityScan(basePackages = "com.gymmanagement.commonservices.entity") // scan Exercise entity
@EnableJpaRepositories(basePackages = "com.gymmanagement.exercise.exercise_management.repository")
@EnableFeignClients
public class ExerciseManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExerciseManagementApplication.class, args);
    }
}
