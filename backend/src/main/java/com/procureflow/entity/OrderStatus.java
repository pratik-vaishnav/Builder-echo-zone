package com.procureflow.entity;

/**
 * Order Status Enumeration
 * Defines the different statuses a purchase order can have
 */
public enum OrderStatus {
    PENDING,        // Order created but not sent to supplier
    SENT,           // Order sent to supplier
    CONFIRMED,      // Order confirmed by supplier
    IN_TRANSIT,     // Items are being shipped
    DELIVERED,      // Items have been delivered
    CANCELLED,      // Order has been cancelled
    COMPLETED       // Order is fully completed and closed
}
