package com.procureflow.entity;

import jakarta.persistence.*;

/**
 * Role Entity
 * Represents user roles in the system (ADMIN, MANAGER, USER, etc.)
 */
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;

    @Column(name = "description")
    private String description;

    // Constructors
    public Role() {}

    public Role(ERole name) {
        this.name = name;
    }

    public Role(ERole name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public ERole getName() { return name; }
    public void setName(ERole name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
