package com.tourist.tourist_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrator implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Hot-patch existing columns that Hibernate ddl-auto=update misses
            jdbcTemplate.execute("ALTER TABLE bus_exterior_images MODIFY image_url TEXT");
            jdbcTemplate.execute("ALTER TABLE bus_interior_images MODIFY image_url TEXT");
            jdbcTemplate.execute("ALTER TABLE homestay_exterior_images MODIFY image_url TEXT");
            jdbcTemplate.execute("ALTER TABLE homestay_interior_images MODIFY image_url TEXT");
            jdbcTemplate.execute("ALTER TABLE tour_package_images MODIFY image_url TEXT");
            System.out.println("✅ SUCCESSFULLY PATCHED DATABASE SCHEMA TO SUPPORT BASE64 IMAGES.");
        } catch (Exception e) {
            // Catch safely in case the tables don't exist yet or other DB dialects
            System.out.println("⚠️ Database patch skipped or already applied: " + e.getMessage());
        }
    }
}
