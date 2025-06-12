package com.procureflow.service;

import com.procureflow.entity.ERole;
import com.procureflow.entity.Role;

import java.util.List;
import java.util.Optional;

/**
 * Role Service Interface
 * Defines business operations for roles
 */
public interface RoleService {

    Optional<Role> findById(Integer id);

    Optional<Role> findByName(ERole name);

    Boolean existsByName(ERole name);

    List<Role> findAll();

    Role createRole(Role role);

    Role updateRole(Role role);

    void deleteById(Integer id);

    List<Object[]> getRoleStatistics();

    Long getUserCountByRole(ERole roleName);

    Boolean isRoleInUse(Integer roleId);

    void initializeDefaultRoles();
}
