package com.gymmanagement.usermanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(scanBasePackages = {
        "com.gymmanagement.usermanagement",  // your controllers/services
        "com.gymmanagement.commonservices"   // common module beans
})
@EntityScan(basePackages = "com.gymmanagement.commonservices.entity") // scan User entity
@EnableJpaRepositories(basePackages = "com.gymmanagement.usermanagement.repository") // your repositories
@EnableAsync
public class UserManagement {
    public static void main(String[] args) {
        SpringApplication.run(UserManagement.class, args);
    }
}
