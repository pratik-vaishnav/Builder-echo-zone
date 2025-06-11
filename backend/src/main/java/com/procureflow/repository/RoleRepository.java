package com.procureflow.repository;

import com.procureflow.entity.ERole;
import com.procureflow.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Role Repository
 * Data access layer for Role entity
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByName(ERole name);

    Boolean existsByName(ERole name);
}
