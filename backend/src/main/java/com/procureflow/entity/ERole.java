package com.procureflow.entity;

/**
 * Role Enumeration
 * Defines the different roles available in the ProcureFlow system
 */
public enum ERole {
    ROLE_USER,          // Regular user who can create requests
    ROLE_MANAGER,       // Manager who can approve requests
    ROLE_ADMIN,         // System administrator
    ROLE_PROCUREMENT,   // Procurement specialist
    ROLE_FINANCE        // Finance team member
}
