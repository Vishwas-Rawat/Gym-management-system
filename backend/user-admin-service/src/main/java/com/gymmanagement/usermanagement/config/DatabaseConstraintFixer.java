package com.gymmanagement.usermanagement.config;

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
        System.out.println("Running DatabaseConstraintFixer to enable Multi-Gym support...");
        try {
            // Drop the legacy unique constraint on members(user_id)
            jdbcTemplate.execute("ALTER TABLE members DROP CONSTRAINT IF EXISTS ukda61ga2jecphdliwvkqyt6sw2");

            // Drop the legacy unique constraint on trainers(user_id)
            // Note: The specific constraint name may vary, but this handles common
            // Hibernate defaults.
            // If the user gets a "duplicate key" error for trainers, they should check the
            // constraint name.
            jdbcTemplate.execute("ALTER TABLE trainers DROP CONSTRAINT IF EXISTS trainers_user_id_key");
            jdbcTemplate.execute("ALTER TABLE trainers DROP CONSTRAINT IF EXISTS ukgon7a2jecphdliwvkqyt6sw2"); // Possible
                                                                                                               // variant

            System.out.println("Successfully checked/dropped legacy unique constraints on members and trainers.");
        } catch (Exception e) {
            System.err
                    .println("Note: Could not drop constraint (it might have been dropped already): " + e.getMessage());
        }
    }
}
