package com.prenatal.backend.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DatabaseMigratorStandalone {
    public static void main(String[] args) {
        String url = "jdbc:h2:file:./data/prenataldb;AUTO_SERVER=TRUE";
        String user = "sa";
        String password = "password";
        
        System.out.println("Iniciando inspección de datos de pacientes...");
        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            try (ResultSet rs = stmt.executeQuery("SELECT id_paciente, nombres, apellidos, fecha_probable_parto FROM pacientes")) {
                while (rs.next()) {
                    System.out.printf("ID: %d | Nombre: %s %s | FPP: %s%n",
                            rs.getLong("id_paciente"),
                            rs.getString("nombres"),
                            rs.getString("apellidos"),
                            rs.getString("fecha_probable_parto"));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
