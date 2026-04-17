package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "diet_proteins")
@Data
public class DietProtein {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer proteinId;

    @OneToOne
    @JoinColumn(name = "meal_id")
    private DietMeal meal;

    private String proteinName;
    private String proteinQuantity;
}
