package com.procureflow.service;

import com.procureflow.entity.User;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * User Service Interface
 * Defines business operations for users
 */
public interface UserService {

    Optional<User> findById(Long id);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    List<User> findByIsActiveTrue(int page, int size, String sortBy, String sortDir);

    List<User> findByDepartment(String department);

    List<User> searchActiveUsers(String search, int page, int size);

    List<User> findByRoleNameAndIsActiveTrue(String roleName);

    List<String> findAllDepartments();

    User createUser(User user);

    User updateUser(User user);

    void updatePassword(Long userId, String newPassword);

    void deactivateUser(Long userId);

    void activateUser(Long userId);

    void deleteById(Long id);

    Map<String, Object> getUserStatistics();

    List<Map<String, Object>> getUserCountByDepartment();

    long getTotalActiveUserCount();

    long getSearchActiveUserCount(String search);

    void addRoleToUser(Long userId, Integer roleId);

    void removeRoleFromUser(Long userId, Integer roleId);

    List<String> getUserRoles(Long userId);
}
