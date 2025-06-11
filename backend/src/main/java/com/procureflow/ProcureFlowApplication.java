package com.procureflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * ProcureFlow - Smart Procurement Platform
 * Main Spring Boot Application Class
 * 
 * @author ProcureFlow Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableTransactionManagement
public class ProcureFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProcureFlowApplication.class, args);
        System.out.println("🚀 ProcureFlow Backend Service Started Successfully!");
        System.out.println("📖 API Documentation: http://localhost:8080/swagger-ui/index.html");
        System.out.println("🔍 Health Check: http://localhost:8080/actuator/health");
    }
}
