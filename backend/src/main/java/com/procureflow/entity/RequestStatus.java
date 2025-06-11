package com.procureflow.entity;

/**
 * Request Status Enumeration
 * Defines the different statuses a purchase request can have
 */
public enum RequestStatus {
    PENDING,        // Initial status when request is created
    UNDER_REVIEW,   // Request is being reviewed
    APPROVED,       // Request has been approved
    REJECTED,       // Request has been rejected
    IN_PROGRESS,    // Request is being processed
    COMPLETED,      // Request has been completed
    CANCELLED       // Request has been cancelled
}
