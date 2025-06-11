package com.procureflow.repository;

import com.procureflow.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * User Repository
 * Data access layer for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    List<User> findByIsActiveTrue();

    Page<User> findByIsActiveTrue(Pageable pageable);

    List<User> findByDepartment(String department);

    @Query("SELECT u FROM User u WHERE u.isActive = true AND " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.department) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> searchActiveUsers(@Param("search") String search, Pageable pageable);

    @Query("SELECT DISTINCT u.department FROM User u WHERE u.department IS NOT NULL ORDER BY u.department")
    List<String> findAllDepartments();

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName AND u.isActive = true")
    List<User> findByRoleNameAndIsActiveTrue(@Param("roleName") String roleName);
}
