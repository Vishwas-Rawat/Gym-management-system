package com.gymmanagement.trainer.trainer_panel.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConstraintFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatabaseConstraintFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Running DatabaseConstraintFixer...");
        try {
            // Drop legacy constraints if they exist.
            jdbcTemplate.execute(
                    "ALTER TABLE workout_plan_items DROP CONSTRAINT IF EXISTS workout_plan_items_exercise_name_check");
            jdbcTemplate.execute("ALTER TABLE diet_plans DROP CONSTRAINT IF EXISTS diet_plans_diet_type_check");

            System.out.println("Successfully checked/dropped database check constraints.");
        } catch (Exception e) {
            System.err.println("Failed to drop constraint: " + e.getMessage());
            // We do not throw the exception to ensure the app continues to start
        }
    }
}
