package com.procureflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * ProcureFlow - Smart Procurement Platform
 * Real-time Procurement Management System
 *
 * @author ProcureFlow Team
 * @version 2.0.0 - Real-time Edition
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableTransactionManagement
@EnableScheduling
@EnableAsync
public class ProcureFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProcureFlowApplication.class, args);
        System.out.println("🚀 ProcureFlow Real-time Backend Started Successfully!");
        System.out.println("📖 API Documentation: http://localhost:8080/swagger-ui/index.html");
        System.out.println("🔍 Health Check: http://localhost:8080/actuator/health");
        System.out.println("⚡ WebSocket Endpoint: ws://localhost:8080/ws");
        System.out.println("💰 Currency: Indian Rupees (₹)");
        System.out.println("🔄 Real-time PR→PO workflow enabled");
    }
}
