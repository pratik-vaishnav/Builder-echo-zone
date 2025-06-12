package com.procureflow.repository.jdbc;

import com.procureflow.entity.Priority;
import com.procureflow.entity.RequestStatus;
import com.procureflow.dto.request.PurchaseRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Optimized JDBC Repository for Purchase Requests
 * Uses raw SQL queries for better performance
 */
@Repository
public class PurchaseRequestJdbcRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<PurchaseRequestDTO> rowMapper = new PurchaseRequestRowMapper();

    /**
     * Get paginated purchase requests with optimized query
     */
    public List<PurchaseRequestDTO> findPaginated(int page, int size, String sortBy, String sortDir) {
        String sql = """
            SELECT pr.id, pr.title, pr.description, pr.department, pr.priority, 
                   pr.status, pr.total_amount, pr.justification, pr.expected_delivery_date,
                   pr.created_at, pr.updated_at,
                   u.id as requested_by_id, u.first_name, u.last_name, u.email,
                   au.id as assigned_to_id, au.first_name as assigned_first_name, 
                   au.last_name as assigned_last_name
            FROM purchase_requests pr
            LEFT JOIN users u ON pr.requested_by = u.id
            LEFT JOIN users au ON pr.assigned_to = au.id
            ORDER BY pr.%s %s
            LIMIT ? OFFSET ?
            """.formatted(sortBy, sortDir.toUpperCase());

        int offset = page * size;
        return jdbcTemplate.query(sql, rowMapper, size, offset);
    }

    /**
     * Get total count for pagination
     */
    public long getTotalCount() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM purchase_requests", Long.class);
    }

    /**
     * Search purchase requests with optimized full-text search
     */
    public List<PurchaseRequestDTO> searchRequests(String searchTerm, int page, int size) {
        String sql = """
            SELECT pr.id, pr.title, pr.description, pr.department, pr.priority, 
                   pr.status, pr.total_amount, pr.justification, pr.expected_delivery_date,
                   pr.created_at, pr.updated_at,
                   u.id as requested_by_id, u.first_name, u.last_name, u.email,
                   au.id as assigned_to_id, au.first_name as assigned_first_name, 
                   au.last_name as assigned_last_name
            FROM purchase_requests pr
            LEFT JOIN users u ON pr.requested_by = u.id
            LEFT JOIN users au ON pr.assigned_to = au.id
            WHERE pr.title LIKE ? OR pr.description LIKE ? OR pr.department LIKE ?
            ORDER BY pr.created_at DESC
            LIMIT ? OFFSET ?
            """;

        String searchPattern = "%" + searchTerm + "%";
        int offset = page * size;
        
        return jdbcTemplate.query(sql, rowMapper, 
            searchPattern, searchPattern, searchPattern, size, offset);
    }

    /**
     * Get requests by multiple criteria with optimized query
     */
    public List<PurchaseRequestDTO> findByMultipleCriteria(
            RequestStatus status, String department, Priority priority, 
            Long requesterId, int page, int size) {
        
        StringBuilder sql = new StringBuilder("""
            SELECT pr.id, pr.title, pr.description, pr.department, pr.priority, 
                   pr.status, pr.total_amount, pr.justification, pr.expected_delivery_date,
                   pr.created_at, pr.updated_at,
                   u.id as requested_by_id, u.first_name, u.last_name, u.email,
                   au.id as assigned_to_id, au.first_name as assigned_first_name, 
                   au.last_name as assigned_last_name
            FROM purchase_requests pr
            LEFT JOIN users u ON pr.requested_by = u.id
            LEFT JOIN users au ON pr.assigned_to = au.id
            WHERE 1=1
            """);

        List<Object> params = new java.util.ArrayList<>();

        if (status != null) {
            sql.append(" AND pr.status = ?");
            params.add(status.name());
        }
        if (department != null) {
            sql.append(" AND pr.department = ?");
            params.add(department);
        }
        if (priority != null) {
            sql.append(" AND pr.priority = ?");
            params.add(priority.name());
        }
        if (requesterId != null) {
            sql.append(" AND pr.requested_by = ?");
            params.add(requesterId);
        }

        sql.append(" ORDER BY pr.created_at DESC LIMIT ? OFFSET ?");
        params.add(size);
        params.add(page * size);

        return jdbcTemplate.query(sql.toString(), rowMapper, params.toArray());
    }

    /**
     * Get statistics with optimized single query
     */
    public Map<String, Object> getStatistics() {
        String sql = """
            SELECT 
                COUNT(*) as total_requests,
                COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_requests,
                COUNT(CASE WHEN status = 'UNDER_REVIEW' THEN 1 END) as under_review_requests,
                COUNT(CASE WHEN status = 'APPROVED' THEN 1 END) as approved_requests,
                COUNT(CASE WHEN status = 'REJECTED' THEN 1 END) as rejected_requests,
                COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress_requests,
                COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_requests,
                COALESCE(SUM(CASE WHEN status = 'COMPLETED' THEN total_amount END), 0) as total_spent,
                COALESCE(SUM(CASE WHEN status = 'PENDING' THEN total_amount END), 0) as pending_amount,
                COALESCE(SUM(CASE WHEN status = 'APPROVED' THEN total_amount END), 0) as approved_amount,
                COALESCE(SUM(CASE WHEN status = 'IN_PROGRESS' THEN total_amount END), 0) as in_progress_amount,
                COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as requests_this_week,
                COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as requests_this_month
            FROM purchase_requests
            """;

        return jdbcTemplate.queryForMap(sql);
    }

    /**
     * Get pending approvals with optimized query
     */
    public List<PurchaseRequestDTO> findPendingApprovals(int limit) {
        String sql = """
            SELECT pr.id, pr.title, pr.description, pr.department, pr.priority, 
                   pr.status, pr.total_amount, pr.justification, pr.expected_delivery_date,
                   pr.created_at, pr.updated_at,
                   u.id as requested_by_id, u.first_name, u.last_name, u.email,
                   au.id as assigned_to_id, au.first_name as assigned_first_name, 
                   au.last_name as assigned_last_name
            FROM purchase_requests pr
            LEFT JOIN users u ON pr.requested_by = u.id
            LEFT JOIN users au ON pr.assigned_to = au.id
            WHERE pr.status IN ('PENDING', 'UNDER_REVIEW')
            ORDER BY 
                CASE pr.priority 
                    WHEN 'URGENT' THEN 1 
                    WHEN 'HIGH' THEN 2 
                    WHEN 'MEDIUM' THEN 3 
                    WHEN 'LOW' THEN 4 
                END,
                pr.created_at ASC
            LIMIT ?
            """;

        return jdbcTemplate.query(sql, rowMapper, limit);
    }

    /**
     * Create new purchase request
     */
    public Long createPurchaseRequest(PurchaseRequestDTO requestDTO, Long requestedById) {
        String sql = """
            INSERT INTO purchase_requests 
            (title, description, department, priority, status, total_amount, 
             justification, expected_delivery_date, requested_by, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'PENDING', ?, ?, ?, ?, NOW(), NOW())
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
            ps.setString(1, requestDTO.getTitle());
            ps.setString(2, requestDTO.getDescription());
            ps.setString(3, requestDTO.getDepartment());
            ps.setString(4, requestDTO.getPriority().name());
            ps.setBigDecimal(5, requestDTO.getTotalAmount());
            ps.setString(6, requestDTO.getJustification());
            ps.setTimestamp(7, requestDTO.getExpectedDeliveryDate() != null ? 
                Timestamp.valueOf(requestDTO.getExpectedDeliveryDate()) : null);
            ps.setLong(8, requestedById);
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    /**
     * Update request status
     */
    public void updateStatus(Long id, RequestStatus status) {
        String sql = "UPDATE purchase_requests SET status = ?, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, status.name(), id);
    }

    /**
     * Get department breakdown for analytics
     */
    public List<Map<String, Object>> getDepartmentBreakdown() {
        String sql = """
            SELECT department, 
                   COUNT(*) as count,
                   COALESCE(SUM(total_amount), 0) as total_amount
            FROM purchase_requests 
            GROUP BY department 
            ORDER BY count DESC
            """;

        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Get recent activity for dashboard
     */
    public List<Map<String, Object>> getRecentActivity(int limit) {
        String sql = """
            SELECT pr.id, pr.title, pr.status, pr.total_amount, pr.created_at,
                   u.first_name, u.last_name
            FROM purchase_requests pr
            LEFT JOIN users u ON pr.requested_by = u.id
            ORDER BY pr.updated_at DESC
            LIMIT ?
            """;

        return jdbcTemplate.queryForList(sql, limit);
    }

    /**
     * Row mapper for PurchaseRequestDTO
     */
    private static class PurchaseRequestRowMapper implements RowMapper<PurchaseRequestDTO> {
        @Override
        public PurchaseRequestDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            PurchaseRequestDTO dto = new PurchaseRequestDTO();
            
            dto.setId(rs.getLong("id"));
            dto.setTitle(rs.getString("title"));
            dto.setDescription(rs.getString("description"));
            dto.setDepartment(rs.getString("department"));
            dto.setPriority(Priority.valueOf(rs.getString("priority")));
            dto.setStatus(RequestStatus.valueOf(rs.getString("status")));
            dto.setTotalAmount(rs.getBigDecimal("total_amount"));
            dto.setJustification(rs.getString("justification"));
            
            Timestamp expectedDelivery = rs.getTimestamp("expected_delivery_date");
            if (expectedDelivery != null) {
                dto.setExpectedDeliveryDate(expectedDelivery.toLocalDateTime());
            }
            
            Timestamp createdAt = rs.getTimestamp("created_at");
            if (createdAt != null) {
                dto.setCreatedAt(createdAt.toLocalDateTime());
            }
            
            Timestamp updatedAt = rs.getTimestamp("updated_at");
            if (updatedAt != null) {
                dto.setUpdatedAt(updatedAt.toLocalDateTime());
            }

            // Set requester information
            dto.setRequestedById(rs.getLong("requested_by_id"));
            String firstName = rs.getString("first_name");
            String lastName = rs.getString("last_name");
            if (firstName != null && lastName != null) {
                dto.setRequestedByName(firstName + " " + lastName);
            }
            dto.setRequestedByEmail(rs.getString("email"));

            // Set assignee information
            Long assignedToId = rs.getLong("assigned_to_id");
            if (!rs.wasNull()) {
                dto.setAssignedToId(assignedToId);
                String assignedFirstName = rs.getString("assigned_first_name");
                String assignedLastName = rs.getString("assigned_last_name");
                if (assignedFirstName != null && assignedLastName != null) {
                    dto.setAssignedToName(assignedFirstName + " " + assignedLastName);
                }
            }

            // Generate request number
            dto.setRequestNumber("PR-" + String.format("%06d", dto.getId()));
            
            return dto;
        }
    }
}
