package com.prenatal.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE monitoreo ALTER COLUMN porcentaje_riesgo DECIMAL(10, 2)");
            int updatedRows = jdbcTemplate.update(
                "UPDATE monitoreo SET porcentaje_riesgo = ROUND(porcentaje_riesgo, 2) WHERE porcentaje_riesgo IS NOT NULL"
            );
            System.out.println("MIGRACION DB: Se actualizo la columna porcentaje_riesgo a DECIMAL(10, 2) y se redondearon " + updatedRows + " registros.");
        } catch (Exception e) {
            System.err.println("MIGRACION DB ERROR: No se pudo realizar la migracion: " + e.getMessage());
        }
    }
}
