package com.procureflow.repository.jdbc;

import com.procureflow.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Optimized JDBC Repository for Users
 * High-performance database operations using raw SQL
 */
@Repository
public class UserJdbcRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<User> rowMapper = new UserRowMapper();

    /**
     * Find user by ID
     */
    public Optional<User> findById(Long id) {
        String sql = """
            SELECT u.*, GROUP_CONCAT(r.name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.id = ?
            GROUP BY u.id
            """;

        List<User> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Find user by username
     */
    public Optional<User> findByUsername(String username) {
        String sql = """
            SELECT u.*, GROUP_CONCAT(r.name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.username = ?
            GROUP BY u.id
            """;

        List<User> results = jdbcTemplate.query(sql, rowMapper, username);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        String sql = """
            SELECT u.*, GROUP_CONCAT(r.name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.email = ?
            GROUP BY u.id
            """;

        List<User> results = jdbcTemplate.query(sql, rowMapper, email);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Check if username exists
     */
    public Boolean existsByUsername(String username) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count != null && count > 0;
    }

    /**
     * Check if email exists
     */
    public Boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    /**
     * Find all active users with pagination
     */
    public List<User> findByIsActiveTrue(int page, int size, String sortBy, String sortDir) {
        String sql = """
            SELECT u.*, GROUP_CONCAT(r.name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.is_active = true
            GROUP BY u.id
            ORDER BY u.%s %s
            LIMIT ? OFFSET ?
            """.formatted(sortBy, sortDir.toUpperCase());

        return jdbcTemplate.query(sql, rowMapper, size, page * size);
    }

    /**
     * Find users by department
     */
    public List<User> findByDepartment(String department) {
        String sql = """
            SELECT u.*, GROUP_CONCAT(r.name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.department = ? AND u.is_active = true
            GROUP BY u.id
            ORDER BY u.first_name, u.last_name
            """;

        return jdbcTemplate.query(sql, rowMapper, department);
    }

    /**
     * Search active users
     */
    public List<User> searchActiveUsers(String search, int page, int size) {
        String sql = """
            SELECT u.*, GROUP_CONCAT(r.name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.is_active = true AND (
                u.first_name LIKE ? OR u.last_name LIKE ? OR 
                u.email LIKE ? OR u.department LIKE ? OR u.username LIKE ?
            )
            GROUP BY u.id
            ORDER BY u.first_name, u.last_name
            LIMIT ? OFFSET ?
            """;

        String searchPattern = "%" + search + "%";
        return jdbcTemplate.query(sql, rowMapper, 
            searchPattern, searchPattern, searchPattern, searchPattern, searchPattern,
            size, page * size);
    }

    /**
     * Find users by role name
     */
    public List<User> findByRoleNameAndIsActiveTrue(String roleName) {
        String sql = """
            SELECT u.*, GROUP_CONCAT(r.name) as roles
            FROM users u
            JOIN user_roles ur ON u.id = ur.user_id
            JOIN roles r ON ur.role_id = r.id
            WHERE r.name = ? AND u.is_active = true
            GROUP BY u.id
            ORDER BY u.first_name, u.last_name
            """;

        return jdbcTemplate.query(sql, rowMapper, roleName);
    }

    /**
     * Get all departments
     */
    public List<String> findAllDepartments() {
        String sql = """
            SELECT DISTINCT department 
            FROM users 
            WHERE department IS NOT NULL 
            ORDER BY department
            """;

        return jdbcTemplate.queryForList(sql, String.class);
    }

    /**
     * Create new user
     */
    public Long createUser(User user) {
        String sql = """
            INSERT INTO users 
            (username, email, password, first_name, last_name, department, 
             position, phone, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getFirstName());
            ps.setString(5, user.getLastName());
            ps.setString(6, user.getDepartment());
            ps.setString(7, user.getPosition());
            ps.setString(8, user.getPhone());
            ps.setBoolean(9, user.getIsActive() != null ? user.getIsActive() : true);
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    /**
     * Update user
     */
    public void updateUser(User user) {
        String sql = """
            UPDATE users SET 
                username = ?, email = ?, first_name = ?, last_name = ?, 
                department = ?, position = ?, phone = ?, is_active = ?, updated_at = NOW()
            WHERE id = ?
            """;

        jdbcTemplate.update(sql,
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getDepartment(),
            user.getPosition(),
            user.getPhone(),
            user.getIsActive(),
            user.getId()
        );
    }

    /**
     * Update user password
     */
    public void updatePassword(Long userId, String newPassword) {
        String sql = "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, newPassword, userId);
    }

    /**
     * Deactivate user
     */
    public void deactivateUser(Long userId) {
        String sql = "UPDATE users SET is_active = false, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, userId);
    }

    /**
     * Activate user
     */
    public void activateUser(Long userId) {
        String sql = "UPDATE users SET is_active = true, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, userId);
    }

    /**
     * Get user statistics
     */
    public Map<String, Object> getUserStatistics() {
        String sql = """
            SELECT 
                COUNT(*) as total_users,
                COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
                COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_users,
                COUNT(DISTINCT department) as total_departments,
                COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as users_this_week,
                COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as users_this_month
            FROM users
            """;

        return jdbcTemplate.queryForMap(sql);
    }

    /**
     * Get user count by department
     */
    public List<Map<String, Object>> getUserCountByDepartment() {
        String sql = """
            SELECT department, 
                   COUNT(*) as total_count,
                   COUNT(CASE WHEN is_active = true THEN 1 END) as active_count
            FROM users 
            WHERE department IS NOT NULL
            GROUP BY department 
            ORDER BY total_count DESC
            """;

        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Get total count for pagination
     */
    public long getTotalActiveUserCount() {
        String sql = "SELECT COUNT(*) FROM users WHERE is_active = true";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    /**
     * Get total count for search
     */
    public long getSearchActiveUserCount(String search) {
        String sql = """
            SELECT COUNT(*) FROM users 
            WHERE is_active = true AND (
                first_name LIKE ? OR last_name LIKE ? OR 
                email LIKE ? OR department LIKE ? OR username LIKE ?
            )
            """;

        String searchPattern = "%" + search + "%";
        return jdbcTemplate.queryForObject(sql, Long.class,
            searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    /**
     * Add role to user
     */
    public void addRoleToUser(Long userId, Integer roleId) {
        String sql = "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)";
        jdbcTemplate.update(sql, userId, roleId);
    }

    /**
     * Remove role from user
     */
    public void removeRoleFromUser(Long userId, Integer roleId) {
        String sql = "DELETE FROM user_roles WHERE user_id = ? AND role_id = ?";
        jdbcTemplate.update(sql, userId, roleId);
    }

    /**
     * Get user roles
     */
    public List<String> getUserRoles(Long userId) {
        String sql = """
            SELECT r.name 
            FROM roles r 
            JOIN user_roles ur ON r.id = ur.role_id 
            WHERE ur.user_id = ?
            """;

        return jdbcTemplate.queryForList(sql, String.class, userId);
    }

    /**
     * Delete user (hard delete)
     */
    public void deleteById(Long id) {
        // First delete user roles
        jdbcTemplate.update("DELETE FROM user_roles WHERE user_id = ?", id);
        // Then delete user
        jdbcTemplate.update("DELETE FROM users WHERE id = ?", id);
    }

    /**
     * Row mapper for User
     */
    private static class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            
            user.setId(rs.getLong("id"));
            user.setUsername(rs.getString("username"));
            user.setEmail(rs.getString("email"));
            user.setPassword(rs.getString("password"));
            user.setFirstName(rs.getString("first_name"));
            user.setLastName(rs.getString("last_name"));
            user.setDepartment(rs.getString("department"));
            user.setPosition(rs.getString("position"));
            user.setPhone(rs.getString("phone"));
            user.setIsActive(rs.getBoolean("is_active"));

            Timestamp createdAt = rs.getTimestamp("created_at");
            if (createdAt != null) {
                user.setCreatedAt(createdAt.toLocalDateTime());
            }

            Timestamp updatedAt = rs.getTimestamp("updated_at");
            if (updatedAt != null) {
                user.setUpdatedAt(updatedAt.toLocalDateTime());
            }

            return user;
        }
    }
}
