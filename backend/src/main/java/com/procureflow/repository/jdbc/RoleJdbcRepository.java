package com.procureflow.repository.jdbc;

import com.procureflow.entity.ERole;
import com.procureflow.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/**
 * Optimized JDBC Repository for Roles
 * High-performance database operations using raw SQL
 */
@Repository
public class RoleJdbcRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Role> rowMapper = new RoleRowMapper();

    /**
     * Find role by ID
     */
    public Optional<Role> findById(Integer id) {
        String sql = "SELECT * FROM roles WHERE id = ?";
        List<Role> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Find role by name
     */
    public Optional<Role> findByName(ERole name) {
        String sql = "SELECT * FROM roles WHERE name = ?";
        List<Role> results = jdbcTemplate.query(sql, rowMapper, name.name());
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Check if role exists by name
     */
    public Boolean existsByName(ERole name) {
        String sql = "SELECT COUNT(*) FROM roles WHERE name = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, name.name());
        return count != null && count > 0;
    }

    /**
     * Find all roles
     */
    public List<Role> findAll() {
        String sql = "SELECT * FROM roles ORDER BY name";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Create new role
     */
    public Integer createRole(Role role) {
        String sql = "INSERT INTO roles (name) VALUES (?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
            ps.setString(1, role.getName().name());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().intValue();
    }

    /**
     * Update role
     */
    public void updateRole(Role role) {
        String sql = "UPDATE roles SET name = ? WHERE id = ?";
        jdbcTemplate.update(sql, role.getName().name(), role.getId());
    }

    /**
     * Delete role
     */
    public void deleteById(Integer id) {
        // First remove role from all users
        jdbcTemplate.update("DELETE FROM user_roles WHERE role_id = ?", id);
        // Then delete the role
        jdbcTemplate.update("DELETE FROM roles WHERE id = ?", id);
    }

    /**
     * Get role statistics
     */
    public List<Object[]> getRoleStatistics() {
        String sql = """
            SELECT r.name, COUNT(ur.user_id) as user_count
            FROM roles r
            LEFT JOIN user_roles ur ON r.id = ur.role_id
            GROUP BY r.id, r.name
            ORDER BY user_count DESC
            """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new Object[]{
            rs.getString("name"),
            rs.getLong("user_count")
        });
    }

    /**
     * Get users count by role
     */
    public Long getUserCountByRole(ERole roleName) {
        String sql = """
            SELECT COUNT(ur.user_id)
            FROM roles r
            JOIN user_roles ur ON r.id = ur.role_id
            WHERE r.name = ?
            """;

        return jdbcTemplate.queryForObject(sql, Long.class, roleName.name());
    }

    /**
     * Check if role is used by any user
     */
    public Boolean isRoleInUse(Integer roleId) {
        String sql = "SELECT COUNT(*) FROM user_roles WHERE role_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, roleId);
        return count != null && count > 0;
    }

    /**
     * Initialize default roles if they don't exist
     */
    public void initializeDefaultRoles() {
        for (ERole role : ERole.values()) {
            if (!existsByName(role)) {
                Role newRole = new Role();
                newRole.setName(role);
                createRole(newRole);
            }
        }
    }

    /**
     * Row mapper for Role
     */
    private static class RoleRowMapper implements RowMapper<Role> {
        @Override
        public Role mapRow(ResultSet rs, int rowNum) throws SQLException {
            Role role = new Role();
            role.setId(rs.getInt("id"));
            role.setName(ERole.valueOf(rs.getString("name")));
            return role;
        }
    }
}
