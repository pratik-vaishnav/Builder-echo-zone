package com.procureflow.repository.jdbc;

import com.procureflow.entity.Approval;
import com.procureflow.entity.ApprovalStatus;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Optimized JDBC Repository for Approvals
 * High-performance database operations using raw SQL
 */
@Repository
public class ApprovalJdbcRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Approval> rowMapper = new ApprovalRowMapper();

    /**
     * Find approval by ID
     */
    public Optional<Approval> findById(Long id) {
        String sql = """
            SELECT a.*, 
                   pr.title as request_title, pr.department, pr.total_amount as request_amount,
                   u.first_name as approver_first_name, u.last_name as approver_last_name, u.email as approver_email,
                   req.first_name as requester_first_name, req.last_name as requester_last_name
            FROM approvals a
            LEFT JOIN purchase_requests pr ON a.purchase_request_id = pr.id
            LEFT JOIN users u ON a.approver_id = u.id
            LEFT JOIN users req ON pr.requested_by = req.id
            WHERE a.id = ?
            """;

        List<Approval> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Find approvals by purchase request ID
     */
    public List<Approval> findByPurchaseRequestId(Long purchaseRequestId) {
        String sql = """
            SELECT a.*, 
                   pr.title as request_title, pr.department, pr.total_amount as request_amount,
                   u.first_name as approver_first_name, u.last_name as approver_last_name, u.email as approver_email,
                   req.first_name as requester_first_name, req.last_name as requester_last_name
            FROM approvals a
            LEFT JOIN purchase_requests pr ON a.purchase_request_id = pr.id
            LEFT JOIN users u ON a.approver_id = u.id
            LEFT JOIN users req ON pr.requested_by = req.id
            WHERE a.purchase_request_id = ?
            ORDER BY a.created_at ASC
            """;

        return jdbcTemplate.query(sql, rowMapper, purchaseRequestId);
    }

    /**
     * Find approvals by approver ID with pagination
     */
    public List<Approval> findByApproverId(Long approverId, int page, int size) {
        String sql = """
            SELECT a.*, 
                   pr.title as request_title, pr.department, pr.total_amount as request_amount,
                   u.first_name as approver_first_name, u.last_name as approver_last_name, u.email as approver_email,
                   req.first_name as requester_first_name, req.last_name as requester_last_name
            FROM approvals a
            LEFT JOIN purchase_requests pr ON a.purchase_request_id = pr.id
            LEFT JOIN users u ON a.approver_id = u.id
            LEFT JOIN users req ON pr.requested_by = req.id
            WHERE a.approver_id = ?
            ORDER BY a.created_at DESC
            LIMIT ? OFFSET ?
            """;

        return jdbcTemplate.query(sql, rowMapper, approverId, size, page * size);
    }

    /**
     * Find approvals by status with pagination
     */
    public List<Approval> findByStatus(ApprovalStatus status, int page, int size) {
        String sql = """
            SELECT a.*, 
                   pr.title as request_title, pr.department, pr.total_amount as request_amount,
                   u.first_name as approver_first_name, u.last_name as approver_last_name, u.email as approver_email,
                   req.first_name as requester_first_name, req.last_name as requester_last_name
            FROM approvals a
            LEFT JOIN purchase_requests pr ON a.purchase_request_id = pr.id
            LEFT JOIN users u ON a.approver_id = u.id
            LEFT JOIN users req ON pr.requested_by = req.id
            WHERE a.status = ?
            ORDER BY a.created_at DESC
            LIMIT ? OFFSET ?
            """;

        return jdbcTemplate.query(sql, rowMapper, status.name(), size, page * size);
    }

    /**
     * Find approvals by approver and status
     */
    public List<Approval> findByApproverIdAndStatus(Long approverId, ApprovalStatus status, int page, int size) {
        String sql = """
            SELECT a.*, 
                   pr.title as request_title, pr.department, pr.total_amount as request_amount,
                   u.first_name as approver_first_name, u.last_name as approver_last_name, u.email as approver_email,
                   req.first_name as requester_first_name, req.last_name as requester_last_name
            FROM approvals a
            LEFT JOIN purchase_requests pr ON a.purchase_request_id = pr.id
            LEFT JOIN users u ON a.approver_id = u.id
            LEFT JOIN users req ON pr.requested_by = req.id
            WHERE a.approver_id = ? AND a.status = ?
            ORDER BY a.created_at DESC
            LIMIT ? OFFSET ?
            """;

        return jdbcTemplate.query(sql, rowMapper, approverId, status.name(), size, page * size);
    }

    /**
     * Find pending approvals
     */
    public List<Approval> findPendingApprovals(int limit) {
        String sql = """
            SELECT a.*, 
                   pr.title as request_title, pr.department, pr.total_amount as request_amount,
                   u.first_name as approver_first_name, u.last_name as approver_last_name, u.email as approver_email,
                   req.first_name as requester_first_name, req.last_name as requester_last_name
            FROM approvals a
            LEFT JOIN purchase_requests pr ON a.purchase_request_id = pr.id
            LEFT JOIN users u ON a.approver_id = u.id
            LEFT JOIN users req ON pr.requested_by = req.id
            WHERE a.status = 'PENDING'
            ORDER BY pr.priority DESC, a.created_at ASC
            LIMIT ?
            """;

        return jdbcTemplate.query(sql, rowMapper, limit);
    }

    /**
     * Create new approval
     */
    public Long createApproval(Approval approval) {
        String sql = """
            INSERT INTO approvals 
            (purchase_request_id, approver_id, status, level, comments, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
            ps.setLong(1, approval.getPurchaseRequest().getId());
            ps.setLong(2, approval.getApprover().getId());
            ps.setString(3, approval.getStatus().name());
            ps.setInt(4, approval.getLevel());
            ps.setString(5, approval.getComments());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    /**
     * Update approval status
     */
    public void updateApprovalStatus(Long id, ApprovalStatus status, String comments) {
        String sql = """
            UPDATE approvals SET 
                status = ?, comments = ?, updated_at = NOW()
            WHERE id = ?
            """;

        jdbcTemplate.update(sql, status.name(), comments, id);
    }

    /**
     * Update approval
     */
    public void updateApproval(Approval approval) {
        String sql = """
            UPDATE approvals SET 
                status = ?, comments = ?, level = ?, updated_at = NOW()
            WHERE id = ?
            """;

        jdbcTemplate.update(sql,
            approval.getStatus().name(),
            approval.getComments(),
            approval.getLevel(),
            approval.getId()
        );
    }

    /**
     * Count approvals by approver and status
     */
    public Long countByApproverIdAndStatus(Long approverId, ApprovalStatus status) {
        String sql = "SELECT COUNT(*) FROM approvals WHERE approver_id = ? AND status = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, approverId, status.name());
    }

    /**
     * Count approvals since date by status
     */
    public Long countApprovalsSince(LocalDateTime startDate, ApprovalStatus status) {
        String sql = "SELECT COUNT(*) FROM approvals WHERE created_at >= ? AND status = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, Timestamp.valueOf(startDate), status.name());
    }

    /**
     * Get average approval time in hours
     */
    public Double getAverageApprovalTimeInHours() {
        String sql = """
            SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) 
            FROM approvals 
            WHERE status != 'PENDING' AND updated_at IS NOT NULL
            """;

        return jdbcTemplate.queryForObject(sql, Double.class);
    }

    /**
     * Get approval statistics
     */
    public Map<String, Object> getApprovalStatistics() {
        String sql = """
            SELECT 
                COUNT(*) as total_approvals,
                COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_approvals,
                COUNT(CASE WHEN status = 'APPROVED' THEN 1 END) as approved_approvals,
                COUNT(CASE WHEN status = 'REJECTED' THEN 1 END) as rejected_approvals,
                AVG(CASE WHEN status != 'PENDING' AND updated_at IS NOT NULL 
                    THEN TIMESTAMPDIFF(HOUR, created_at, updated_at) END) as avg_approval_time_hours,
                COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as approvals_this_week,
                COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as approvals_this_month
            FROM approvals
            """;

        return jdbcTemplate.queryForMap(sql);
    }

    /**
     * Get approval count by status
     */
    public List<Map<String, Object>> getApprovalCountByStatus() {
        String sql = """
            SELECT status, COUNT(*) as count
            FROM approvals 
            GROUP BY status 
            ORDER BY count DESC
            """;

        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Get approval count by level
     */
    public List<Map<String, Object>> getApprovalCountByLevel() {
        String sql = """
            SELECT level, COUNT(*) as count, 
                   AVG(CASE WHEN status != 'PENDING' AND updated_at IS NOT NULL 
                       THEN TIMESTAMPDIFF(HOUR, created_at, updated_at) END) as avg_time_hours
            FROM approvals 
            GROUP BY level 
            ORDER BY level ASC
            """;

        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Get total count for pagination
     */
    public long getTotalCountByApproverId(Long approverId) {
        String sql = "SELECT COUNT(*) FROM approvals WHERE approver_id = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, approverId);
    }

    /**
     * Get total count for pagination by status
     */
    public long getTotalCountByStatus(ApprovalStatus status) {
        String sql = "SELECT COUNT(*) FROM approvals WHERE status = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, status.name());
    }

    /**
     * Get total count for pagination by approver and status
     */
    public long getTotalCountByApproverIdAndStatus(Long approverId, ApprovalStatus status) {
        String sql = "SELECT COUNT(*) FROM approvals WHERE approver_id = ? AND status = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, approverId, status.name());
    }

    /**
     * Delete approval
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM approvals WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * Row mapper for Approval
     */
    private static class ApprovalRowMapper implements RowMapper<Approval> {
        @Override
        public Approval mapRow(ResultSet rs, int rowNum) throws SQLException {
            Approval approval = new Approval();
            
            approval.setId(rs.getLong("id"));
            approval.setStatus(ApprovalStatus.valueOf(rs.getString("status")));
            approval.setLevel(rs.getInt("level"));
            approval.setComments(rs.getString("comments"));

            Timestamp createdAt = rs.getTimestamp("created_at");
            if (createdAt != null) {
                approval.setCreatedAt(createdAt.toLocalDateTime());
            }

            Timestamp updatedAt = rs.getTimestamp("updated_at");
            if (updatedAt != null) {
                approval.setUpdatedAt(updatedAt.toLocalDateTime());
            }

            return approval;
        }
    }
}
