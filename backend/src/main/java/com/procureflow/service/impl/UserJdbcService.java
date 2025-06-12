package com.procureflow.service.impl;

import com.procureflow.entity.User;
import com.procureflow.repository.jdbc.UserJdbcRepository;
import com.procureflow.repository.jdbc.RoleJdbcRepository;
import com.procureflow.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * User Service Implementation using JDBC Template
 * High-performance service layer with optimized database operations
 */
@Service
@Transactional
public class UserJdbcService implements UserService {

    @Autowired
    private UserJdbcRepository userRepository;

    @Autowired
    private RoleJdbcRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public List<User> findByIsActiveTrue(int page, int size, String sortBy, String sortDir) {
        return userRepository.findByIsActiveTrue(page, size, sortBy, sortDir);
    }

    @Override
    public List<User> findByDepartment(String department) {
        return userRepository.findByDepartment(department);
    }

    @Override
    public List<User> searchActiveUsers(String search, int page, int size) {
        return userRepository.searchActiveUsers(search, page, size);
    }

    @Override
    public List<User> findByRoleNameAndIsActiveTrue(String roleName) {
        return userRepository.findByRoleNameAndIsActiveTrue(roleName);
    }

    @Override
    public List<String> findAllDepartments() {
        return userRepository.findAllDepartments();
    }

    @Override
    public User createUser(User user) {
        // Validate username and email are unique
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken: " + user.getUsername());
        }
        
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use: " + user.getEmail());
        }

        // Encode password
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        // Set default active status
        if (user.getIsActive() == null) {
            user.setIsActive(true);
        }

        Long id = userRepository.createUser(user);
        return userRepository.findById(id).orElse(user);
    }

    @Override
    public User updateUser(User user) {
        // Check if user exists
        Optional<User> existingUser = userRepository.findById(user.getId());
        if (existingUser.isEmpty()) {
            throw new RuntimeException("User not found with id: " + user.getId());
        }

        User existing = existingUser.get();

        // Check username uniqueness (if changed)
        if (!existing.getUsername().equals(user.getUsername()) && 
            userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken: " + user.getUsername());
        }

        // Check email uniqueness (if changed)
        if (!existing.getEmail().equals(user.getEmail()) && 
            userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use: " + user.getEmail());
        }

        // Don't update password through this method (use updatePassword instead)
        user.setPassword(existing.getPassword());

        userRepository.updateUser(user);
        return userRepository.findById(user.getId()).orElse(user);
    }

    @Override
    public void updatePassword(Long userId, String newPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }

        String encodedPassword = passwordEncoder.encode(newPassword);
        userRepository.updatePassword(userId, encodedPassword);
    }

    @Override
    public void deactivateUser(Long userId) {
        userRepository.deactivateUser(userId);
    }

    @Override
    public void activateUser(Long userId) {
        userRepository.activateUser(userId);
    }

    @Override
    public void deleteById(Long id) {
        // Check if user can be deleted (no references in other tables)
        // This is a soft implementation - in production you'd check for dependencies
        userRepository.deleteById(id);
    }

    @Override
    public Map<String, Object> getUserStatistics() {
        return userRepository.getUserStatistics();
    }

    @Override
    public List<Map<String, Object>> getUserCountByDepartment() {
        return userRepository.getUserCountByDepartment();
    }

    @Override
    public long getTotalActiveUserCount() {
        return userRepository.getTotalActiveUserCount();
    }

    @Override
    public long getSearchActiveUserCount(String search) {
        return userRepository.getSearchActiveUserCount(search);
    }

    @Override
    public void addRoleToUser(Long userId, Integer roleId) {
        userRepository.addRoleToUser(userId, roleId);
    }

    @Override
    public void removeRoleFromUser(Long userId, Integer roleId) {
        userRepository.removeRoleFromUser(userId, roleId);
    }

    @Override
    public List<String> getUserRoles(Long userId) {
        return userRepository.getUserRoles(userId);
    }

    // Additional business logic methods

    @Transactional
    public User registerUser(User user, String roleName) {
        // Create the user
        User createdUser = createUser(user);

        // Add role to user if specified
        if (roleName != null && !roleName.trim().isEmpty()) {
            try {
                var role = roleRepository.findByName(com.procureflow.entity.ERole.valueOf(roleName.toUpperCase()));
                if (role.isPresent()) {
                    userRepository.addRoleToUser(createdUser.getId(), role.get().getId());
                }
            } catch (IllegalArgumentException e) {
                // Role name not valid, skip adding role
                System.out.println("Invalid role name: " + roleName);
            }
        }

        return createdUser;
    }

    @Transactional
    public User updateUserProfile(Long userId, User userDetails) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        User existingUser = userOpt.get();
        
        // Update only profile fields (not security-related fields)
        existingUser.setFirstName(userDetails.getFirstName());
        existingUser.setLastName(userDetails.getLastName());
        existingUser.setDepartment(userDetails.getDepartment());
        existingUser.setPosition(userDetails.getPosition());
        existingUser.setPhone(userDetails.getPhone());

        // Email can be updated but check uniqueness
        if (!existingUser.getEmail().equals(userDetails.getEmail())) {
            if (userRepository.existsByEmail(userDetails.getEmail())) {
                throw new RuntimeException("Email is already in use: " + userDetails.getEmail());
            }
            existingUser.setEmail(userDetails.getEmail());
        }

        return updateUser(existingUser);
    }

    public boolean validateCredentials(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty() || !userOpt.get().getIsActive()) {
            return false;
        }

        return passwordEncoder.matches(password, userOpt.get().getPassword());
    }

    public boolean isUserActive(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        return userOpt.isPresent() && userOpt.get().getIsActive();
    }

    public boolean hasRole(Long userId, String roleName) {
        List<String> userRoles = userRepository.getUserRoles(userId);
        return userRoles.contains(roleName);
    }

    public List<User> findManagersInDepartment(String department) {
        // This would typically find users with manager roles in a specific department
        // For now, return all users in department
        return userRepository.findByDepartment(department);
    }

    public List<User> findApprovers() {
        return userRepository.findByRoleNameAndIsActiveTrue("ROLE_MANAGER");
    }

    public Map<String, Object> getDashboardStatistics() {
        return userRepository.getUserStatistics();
    }

    @Transactional
    public void resetPassword(Long userId, String newPassword) {
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }
        updatePassword(userId, newPassword);
    }

    @Transactional
    public User promoteUser(Long userId, String newRole) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        try {
            var role = roleRepository.findByName(com.procureflow.entity.ERole.valueOf(newRole.toUpperCase()));
            if (role.isPresent()) {
                userRepository.addRoleToUser(userId, role.get().getId());
            } else {
                throw new RuntimeException("Role not found: " + newRole);
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role name: " + newRole);
        }

        return userRepository.findById(userId).orElse(null);
    }

    public List<User> getRecentlyJoinedUsers(int limit) {
        return userRepository.findByIsActiveTrue(0, limit, "created_at", "DESC");
    }

    public boolean canUserAccessResource(Long userId, String resource) {
        // Implementation would depend on your authorization logic
        // For now, just check if user is active
        return isUserActive(userId);
    }
}
