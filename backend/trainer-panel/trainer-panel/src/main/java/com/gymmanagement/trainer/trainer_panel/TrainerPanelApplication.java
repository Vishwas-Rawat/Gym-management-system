package com.gymmanagement.trainer.trainer_panel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.gymmanagement.trainer.trainer_panel.client")
@EntityScan(basePackages = {
        "com.gymmanagement.trainer.trainer_panel",
        "com.gymmanagement.commonservices.entity"   
})
@EnableJpaRepositories(basePackages = {
        "com.gymmanagement.trainer.trainer_panel.repository",
        "com.gymmanagement.commonservices"          
})
public class TrainerPanelApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrainerPanelApplication.class, args);
    }
}
