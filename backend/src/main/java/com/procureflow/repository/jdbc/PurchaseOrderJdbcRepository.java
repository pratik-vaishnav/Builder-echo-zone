package com.procureflow.repository.jdbc;

import com.procureflow.entity.OrderStatus;
import com.procureflow.entity.PurchaseOrder;
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
 * Optimized JDBC Repository for Purchase Orders
 * High-performance database operations using raw SQL
 */
@Repository
public class PurchaseOrderJdbcRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<PurchaseOrder> rowMapper = new PurchaseOrderRowMapper();

    /**
     * Find purchase order by ID
     */
    public Optional<PurchaseOrder> findById(Long id) {
        String sql = """
            SELECT po.*, pr.title as request_title, pr.department,
                   u.first_name, u.last_name, u.email
            FROM purchase_orders po
            LEFT JOIN purchase_requests pr ON po.purchase_request_id = pr.id
            LEFT JOIN users u ON po.created_by = u.id
            WHERE po.id = ?
            """;

        List<PurchaseOrder> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Find purchase order by order number
     */
    public Optional<PurchaseOrder> findByOrderNumber(String orderNumber) {
        String sql = """
            SELECT po.*, pr.title as request_title, pr.department,
                   u.first_name, u.last_name, u.email
            FROM purchase_orders po
            LEFT JOIN purchase_requests pr ON po.purchase_request_id = pr.id
            LEFT JOIN users u ON po.created_by = u.id
            WHERE po.order_number = ?
            """;

        List<PurchaseOrder> results = jdbcTemplate.query(sql, rowMapper, orderNumber);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Find by purchase request ID
     */
    public Optional<PurchaseOrder> findByPurchaseRequestId(Long purchaseRequestId) {
        String sql = """
            SELECT po.*, pr.title as request_title, pr.department,
                   u.first_name, u.last_name, u.email
            FROM purchase_orders po
            LEFT JOIN purchase_requests pr ON po.purchase_request_id = pr.id
            LEFT JOIN users u ON po.created_by = u.id
            WHERE po.purchase_request_id = ?
            """;

        List<PurchaseOrder> results = jdbcTemplate.query(sql, rowMapper, purchaseRequestId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Get paginated purchase orders with filters
     */
    public List<PurchaseOrder> findPaginated(int page, int size, String sortBy, String sortDir, 
                                           OrderStatus status, String search) {
        StringBuilder sql = new StringBuilder("""
            SELECT po.*, pr.title as request_title, pr.department,
                   u.first_name, u.last_name, u.email
            FROM purchase_orders po
            LEFT JOIN purchase_requests pr ON po.purchase_request_id = pr.id
            LEFT JOIN users u ON po.created_by = u.id
            WHERE 1=1
            """);

        List<Object> params = new java.util.ArrayList<>();

        if (status != null) {
            sql.append(" AND po.status = ?");
            params.add(status.name());
        }

        if (search != null && !search.trim().isEmpty()) {
            sql.append(" AND (po.order_number LIKE ? OR po.supplier_name LIKE ? OR pr.title LIKE ?)");
            String searchPattern = "%" + search + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }

        sql.append(" ORDER BY po.").append(sortBy).append(" ").append(sortDir.toUpperCase());
        sql.append(" LIMIT ? OFFSET ?");

        params.add(size);
        params.add(page * size);

        return jdbcTemplate.query(sql.toString(), rowMapper, params.toArray());
    }

    /**
     * Get total count for pagination
     */
    public long getTotalCount(OrderStatus status, String search) {
        StringBuilder sql = new StringBuilder("""
            SELECT COUNT(*)
            FROM purchase_orders po
            LEFT JOIN purchase_requests pr ON po.purchase_request_id = pr.id
            WHERE 1=1
            """);

        List<Object> params = new java.util.ArrayList<>();

        if (status != null) {
            sql.append(" AND po.status = ?");
            params.add(status.name());
        }

        if (search != null && !search.trim().isEmpty()) {
            sql.append(" AND (po.order_number LIKE ? OR po.supplier_name LIKE ? OR pr.title LIKE ?)");
            String searchPattern = "%" + search + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
    }

    /**
     * Find orders by status
     */
    public List<PurchaseOrder> findByStatus(OrderStatus status, int page, int size) {
        String sql = """
            SELECT po.*, pr.title as request_title, pr.department,
                   u.first_name, u.last_name, u.email
            FROM purchase_orders po
            LEFT JOIN purchase_requests pr ON po.purchase_request_id = pr.id
            LEFT JOIN users u ON po.created_by = u.id
            WHERE po.status = ?
            ORDER BY po.created_at DESC
            LIMIT ? OFFSET ?
            """;

        return jdbcTemplate.query(sql, rowMapper, status.name(), size, page * size);
    }

    /**
     * Find orders by created by user
     */
    public List<PurchaseOrder> findByCreatedById(Long createdById, int page, int size) {
        String sql = """
            SELECT po.*, pr.title as request_title, pr.department,
                   u.first_name, u.last_name, u.email
            FROM purchase_orders po
            LEFT JOIN purchase_requests pr ON po.purchase_request_id = pr.id
            LEFT JOIN users u ON po.created_by = u.id
            WHERE po.created_by = ?
            ORDER BY po.created_at DESC
            LIMIT ? OFFSET ?
            """;

        return jdbcTemplate.query(sql, rowMapper, createdById, size, page * size);
    }

    /**
     * Create new purchase order
     */
    public Long createPurchaseOrder(PurchaseOrder order) {
        String sql = """
            INSERT INTO purchase_orders 
            (order_number, status, total_amount, supplier_name, supplier_contact, 
             supplier_email, delivery_address, purchase_request_id, expected_delivery_date,
             terms_conditions, special_instructions, created_by, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
            ps.setString(1, order.getOrderNumber());
            ps.setString(2, order.getStatus().name());
            ps.setBigDecimal(3, order.getTotalAmount());
            ps.setString(4, order.getSupplierName());
            ps.setString(5, order.getSupplierContact());
            ps.setString(6, order.getSupplierEmail());
            ps.setString(7, order.getDeliveryAddress());
            ps.setLong(8, order.getPurchaseRequest().getId());
            ps.setTimestamp(9, order.getExpectedDeliveryDate() != null ? 
                Timestamp.valueOf(order.getExpectedDeliveryDate()) : null);
            ps.setString(10, order.getTermsConditions());
            ps.setString(11, order.getSpecialInstructions());
            ps.setLong(12, order.getCreatedBy().getId());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    /**
     * Update purchase order status
     */
    public void updateStatus(Long id, OrderStatus status) {
        String sql = "UPDATE purchase_orders SET status = ?, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, status.name(), id);
    }

    /**
     * Update purchase order
     */
    public void updatePurchaseOrder(PurchaseOrder order) {
        String sql = """
            UPDATE purchase_orders SET 
                status = ?, supplier_name = ?, supplier_contact = ?, supplier_email = ?,
                delivery_address = ?, expected_delivery_date = ?, terms_conditions = ?,
                special_instructions = ?, updated_at = NOW()
            WHERE id = ?
            """;

        jdbcTemplate.update(sql,
            order.getStatus().name(),
            order.getSupplierName(),
            order.getSupplierContact(),
            order.getSupplierEmail(),
            order.getDeliveryAddress(),
            order.getExpectedDeliveryDate() != null ? Timestamp.valueOf(order.getExpectedDeliveryDate()) : null,
            order.getTermsConditions(),
            order.getSpecialInstructions(),
            order.getId()
        );
    }

    /**
     * Find overdue orders
     */
    public List<PurchaseOrder> findOverdueOrders() {
        String sql = """
            SELECT po.*, pr.title as request_title, pr.department,
                   u.first_name, u.last_name, u.email
            FROM purchase_orders po
            LEFT JOIN purchase_requests pr ON po.purchase_request_id = pr.id
            LEFT JOIN users u ON po.created_by = u.id
            WHERE po.expected_delivery_date < NOW() 
            AND po.status NOT IN ('DELIVERED', 'COMPLETED', 'CANCELLED')
            ORDER BY po.expected_delivery_date ASC
            """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Find orders by delivery date range
     */
    public List<PurchaseOrder> findByExpectedDeliveryDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        String sql = """
            SELECT po.*, pr.title as request_title, pr.department,
                   u.first_name, u.last_name, u.email
            FROM purchase_orders po
            LEFT JOIN purchase_requests pr ON po.purchase_request_id = pr.id
            LEFT JOIN users u ON po.created_by = u.id
            WHERE po.expected_delivery_date BETWEEN ? AND ?
            ORDER BY po.expected_delivery_date ASC
            """;

        return jdbcTemplate.query(sql, rowMapper, 
            Timestamp.valueOf(startDate), Timestamp.valueOf(endDate));
    }

    /**
     * Get order statistics
     */
    public Map<String, Object> getOrderStatistics() {
        String sql = """
            SELECT 
                COUNT(*) as total_orders,
                COUNT(CASE WHEN status = 'DRAFT' THEN 1 END) as draft_orders,
                COUNT(CASE WHEN status = 'SENT' THEN 1 END) as sent_orders,
                COUNT(CASE WHEN status = 'CONFIRMED' THEN 1 END) as confirmed_orders,
                COUNT(CASE WHEN status = 'IN_TRANSIT' THEN 1 END) as in_transit_orders,
                COUNT(CASE WHEN status = 'DELIVERED' THEN 1 END) as delivered_orders,
                COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_orders,
                COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelled_orders,
                COALESCE(SUM(CASE WHEN status = 'COMPLETED' THEN total_amount END), 0) as total_completed_amount,
                COALESCE(SUM(CASE WHEN status IN ('SENT', 'CONFIRMED', 'IN_TRANSIT') THEN total_amount END), 0) as total_pending_amount,
                COUNT(CASE WHEN expected_delivery_date < NOW() AND status NOT IN ('DELIVERED', 'COMPLETED', 'CANCELLED') THEN 1 END) as overdue_orders
            FROM purchase_orders
            """;

        return jdbcTemplate.queryForMap(sql);
    }

    /**
     * Get order count by status
     */
    public List<Map<String, Object>> getOrderCountByStatus() {
        String sql = """
            SELECT status, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total_amount
            FROM purchase_orders 
            GROUP BY status 
            ORDER BY count DESC
            """;

        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Delete purchase order
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM purchase_orders WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * Generate next order number
     */
    public String generateOrderNumber() {
        String sql = "SELECT COALESCE(MAX(CAST(SUBSTRING(order_number, 4) AS UNSIGNED)), 0) + 1 FROM purchase_orders WHERE order_number LIKE 'PO-%'";
        Integer nextNumber = jdbcTemplate.queryForObject(sql, Integer.class);
        return String.format("PO-%06d", nextNumber);
    }

    /**
     * Row mapper for PurchaseOrder
     */
    private static class PurchaseOrderRowMapper implements RowMapper<PurchaseOrder> {
        @Override
        public PurchaseOrder mapRow(ResultSet rs, int rowNum) throws SQLException {
            PurchaseOrder order = new PurchaseOrder();
            
            order.setId(rs.getLong("id"));
            order.setOrderNumber(rs.getString("order_number"));
            order.setStatus(OrderStatus.valueOf(rs.getString("status")));
            order.setTotalAmount(rs.getBigDecimal("total_amount"));
            order.setSupplierName(rs.getString("supplier_name"));
            order.setSupplierContact(rs.getString("supplier_contact"));
            order.setSupplierEmail(rs.getString("supplier_email"));
            order.setDeliveryAddress(rs.getString("delivery_address"));
            order.setTermsConditions(rs.getString("terms_conditions"));
            order.setSpecialInstructions(rs.getString("special_instructions"));

            Timestamp expectedDelivery = rs.getTimestamp("expected_delivery_date");
            if (expectedDelivery != null) {
                order.setExpectedDeliveryDate(expectedDelivery.toLocalDateTime());
            }

            Timestamp createdAt = rs.getTimestamp("created_at");
            if (createdAt != null) {
                order.setCreatedAt(createdAt.toLocalDateTime());
            }

            Timestamp updatedAt = rs.getTimestamp("updated_at");
            if (updatedAt != null) {
                order.setUpdatedAt(updatedAt.toLocalDateTime());
            }

            return order;
        }
    }
}
