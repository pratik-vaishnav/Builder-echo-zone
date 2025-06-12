package com.procureflow.service.impl;

import com.procureflow.entity.ERole;
import com.procureflow.entity.Role;
import com.procureflow.repository.jdbc.RoleJdbcRepository;
import com.procureflow.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Role Service Implementation using JDBC Template
 * High-performance service layer with optimized database operations
 */
@Service
@Transactional
public class RoleJdbcService implements RoleService {

    @Autowired
    private RoleJdbcRepository roleRepository;

    @Override
    public Optional<Role> findById(Integer id) {
        return roleRepository.findById(id);
    }

    @Override
    public Optional<Role> findByName(ERole name) {
        return roleRepository.findByName(name);
    }

    @Override
    public Boolean existsByName(ERole name) {
        return roleRepository.existsByName(name);
    }

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public Role createRole(Role role) {
        // Check if role already exists
        if (roleRepository.existsByName(role.getName())) {
            throw new RuntimeException("Role already exists: " + role.getName());
        }

        Integer id = roleRepository.createRole(role);
        return roleRepository.findById(id).orElse(role);
    }

    @Override
    public Role updateRole(Role role) {
        // Check if role exists
        Optional<Role> existingRole = roleRepository.findById(role.getId());
        if (existingRole.isEmpty()) {
            throw new RuntimeException("Role not found with id: " + role.getId());
        }

        // Check if new name conflicts with existing role (if name changed)
        Role existing = existingRole.get();
        if (!existing.getName().equals(role.getName()) && 
            roleRepository.existsByName(role.getName())) {
            throw new RuntimeException("Role name already exists: " + role.getName());
        }

        roleRepository.updateRole(role);
        return roleRepository.findById(role.getId()).orElse(role);
    }

    @Override
    public void deleteById(Integer id) {
        // Check if role is in use
        if (roleRepository.isRoleInUse(id)) {
            throw new RuntimeException("Cannot delete role that is assigned to users");
        }

        roleRepository.deleteById(id);
    }

    @Override
    public List<Object[]> getRoleStatistics() {
        return roleRepository.getRoleStatistics();
    }

    @Override
    public Long getUserCountByRole(ERole roleName) {
        return roleRepository.getUserCountByRole(roleName);
    }

    @Override
    public Boolean isRoleInUse(Integer roleId) {
        return roleRepository.isRoleInUse(roleId);
    }

    @Override
    @Transactional
    public void initializeDefaultRoles() {
        roleRepository.initializeDefaultRoles();
    }

    // Additional business logic methods

    public Role getOrCreateRole(ERole roleName) {
        Optional<Role> roleOpt = roleRepository.findByName(roleName);
        if (roleOpt.isPresent()) {
            return roleOpt.get();
        }

        Role newRole = new Role();
        newRole.setName(roleName);
        return createRole(newRole);
    }

    public List<Role> getAvailableRoles() {
        return roleRepository.findAll();
    }

    public boolean canDeleteRole(Integer roleId) {
        return !roleRepository.isRoleInUse(roleId);
    }

    public Role getDefaultUserRole() {
        return roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Default user role not found"));
    }

    public Role getAdminRole() {
        return roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));
    }

    public Role getManagerRole() {
        return roleRepository.findByName(ERole.ROLE_MANAGER)
                .orElseThrow(() -> new RuntimeException("Manager role not found"));
    }

    public List<Object[]> getRoleUsageReport() {
        return roleRepository.getRoleStatistics();
    }

    @Transactional
    public void ensureSystemRolesExist() {
        // Ensure all system roles exist
        for (ERole role : ERole.values()) {
            if (!roleRepository.existsByName(role)) {
                Role newRole = new Role();
                newRole.setName(role);
                roleRepository.createRole(newRole);
            }
        }
    }

    public boolean isValidRole(String roleName) {
        try {
            ERole.valueOf(roleName.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public ERole parseRoleName(String roleName) {
        try {
            return ERole.valueOf(roleName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role name: " + roleName);
        }
    }
}
