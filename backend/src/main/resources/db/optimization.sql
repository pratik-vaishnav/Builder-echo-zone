-- Database Optimization Scripts for ProcureFlow JDBC Template Implementation
-- Run these scripts to optimize database performance for JDBC operations

-- ========================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ========================================

-- Purchase Requests table indexes
ALTER TABLE purchase_requests 
ADD INDEX idx_pr_status (status),
ADD INDEX idx_pr_department (department),
ADD INDEX idx_pr_priority (priority),
ADD INDEX idx_pr_requested_by (requested_by),
ADD INDEX idx_pr_assigned_to (assigned_to),
ADD INDEX idx_pr_created_at (created_at),
ADD INDEX idx_pr_total_amount (total_amount),
ADD INDEX idx_pr_status_created (status, created_at),
ADD INDEX idx_pr_department_status (department, status),
ADD INDEX idx_pr_priority_status (priority, status);

-- Purchase Orders table indexes
ALTER TABLE purchase_orders 
ADD INDEX idx_po_status (status),
ADD INDEX idx_po_order_number (order_number),
ADD INDEX idx_po_purchase_request_id (purchase_request_id),
ADD INDEX idx_po_created_by (created_by),
ADD INDEX idx_po_created_at (created_at),
ADD INDEX idx_po_expected_delivery (expected_delivery_date),
ADD INDEX idx_po_status_created (status, created_at),
ADD INDEX idx_po_supplier_name (supplier_name);

-- Approvals table indexes
ALTER TABLE approvals 
ADD INDEX idx_app_status (status),
ADD INDEX idx_app_approver_id (approver_id),
ADD INDEX idx_app_purchase_request_id (purchase_request_id),
ADD INDEX idx_app_level (level),
ADD INDEX idx_app_created_at (created_at),
ADD INDEX idx_app_approver_status (approver_id, status),
ADD INDEX idx_app_status_created (status, created_at),
ADD INDEX idx_app_level_status (level, status);

-- Users table indexes
ALTER TABLE users 
ADD INDEX idx_users_username (username),
ADD INDEX idx_users_email (email),
ADD INDEX idx_users_department (department),
ADD INDEX idx_users_is_active (is_active),
ADD INDEX idx_users_created_at (created_at),
ADD INDEX idx_users_active_dept (is_active, department),
ADD INDEX idx_users_name_search (first_name, last_name);

-- User Roles table indexes
ALTER TABLE user_roles 
ADD INDEX idx_ur_user_id (user_id),
ADD INDEX idx_ur_role_id (role_id);

-- Request Items table indexes (if exists)
-- ALTER TABLE request_items 
-- ADD INDEX idx_ri_request_id (purchase_request_id),
-- ADD INDEX idx_ri_name (name),
-- ADD INDEX idx_ri_total_price (total_price);

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- Create a view for purchase request statistics
CREATE OR REPLACE VIEW purchase_request_statistics AS
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
FROM purchase_requests;

-- Create a view for department analytics
CREATE OR REPLACE VIEW department_analytics AS
SELECT 
    department,
    COUNT(*) as total_requests,
    COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_count,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_count,
    COALESCE(SUM(total_amount), 0) as total_amount,
    COALESCE(AVG(total_amount), 0) as avg_amount,
    COALESCE(MAX(total_amount), 0) as max_amount,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as requests_this_month
FROM purchase_requests 
GROUP BY department 
ORDER BY total_amount DESC;

-- Create a view for user request summary
CREATE OR REPLACE VIEW user_request_summary AS
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.department,
    COUNT(pr.id) as total_requests,
    COUNT(CASE WHEN pr.status = 'PENDING' THEN 1 END) as pending_requests,
    COUNT(CASE WHEN pr.status = 'COMPLETED' THEN 1 END) as completed_requests,
    COALESCE(SUM(pr.total_amount), 0) as total_requested_amount,
    COALESCE(SUM(CASE WHEN pr.status = 'COMPLETED' THEN pr.total_amount END), 0) as total_completed_amount
FROM users u
LEFT JOIN purchase_requests pr ON u.id = pr.requested_by
WHERE u.is_active = true
GROUP BY u.id, u.first_name, u.last_name, u.department;

-- ========================================
-- STORED PROCEDURES FOR COMPLEX OPERATIONS
-- ========================================

DELIMITER //

-- Procedure to update request status with audit trail
CREATE PROCEDURE UpdateRequestStatus(
    IN p_request_id BIGINT,
    IN p_new_status VARCHAR(50),
    IN p_updated_by BIGINT,
    IN p_comments TEXT
)
BEGIN
    DECLARE v_old_status VARCHAR(50);
    
    START TRANSACTION;
    
    -- Get current status
    SELECT status INTO v_old_status 
    FROM purchase_requests 
    WHERE id = p_request_id;
    
    -- Update status
    UPDATE purchase_requests 
    SET status = p_new_status, 
        updated_at = NOW(),
        assigned_to = CASE 
            WHEN p_new_status = 'UNDER_REVIEW' THEN p_updated_by
            ELSE assigned_to
        END
    WHERE id = p_request_id;
    
    -- Log the status change (if audit table exists)
    -- INSERT INTO status_audit_log (request_id, old_status, new_status, changed_by, changed_at, comments)
    -- VALUES (p_request_id, v_old_status, p_new_status, p_updated_by, NOW(), p_comments);
    
    COMMIT;
END //

-- Procedure for bulk status updates
CREATE PROCEDURE BulkUpdateStatus(
    IN p_request_ids TEXT,
    IN p_new_status VARCHAR(50),
    IN p_updated_by BIGINT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_id BIGINT;
    DECLARE id_cursor CURSOR FOR 
        SELECT CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_request_ids, ',', numbers.n), ',', -1) AS UNSIGNED) as id
        FROM (
            SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 
            UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
        ) numbers
        WHERE CHAR_LENGTH(p_request_ids) - CHAR_LENGTH(REPLACE(p_request_ids, ',', '')) >= numbers.n - 1;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    START TRANSACTION;
    
    OPEN id_cursor;
    read_loop: LOOP
        FETCH id_cursor INTO v_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        UPDATE purchase_requests 
        SET status = p_new_status, updated_at = NOW()
        WHERE id = v_id;
    END LOOP;
    
    CLOSE id_cursor;
    COMMIT;
END //

DELIMITER ;

-- ========================================
-- DATABASE CONFIGURATION OPTIMIZATION
-- ========================================

-- MySQL configuration recommendations (add to my.cnf):
/*
[mysqld]
# InnoDB Configuration
innodb_buffer_pool_size = 2G                    # 70-80% of available RAM
innodb_log_file_size = 256M
innodb_log_buffer_size = 64M
innodb_flush_log_at_trx_commit = 2
innodb_file_per_table = 1
innodb_read_io_threads = 8
innodb_write_io_threads = 8

# Query Cache (MySQL 5.7 and below)
query_cache_type = 1
query_cache_size = 256M
query_cache_limit = 32M

# Connection Settings
max_connections = 200
max_connect_errors = 1000000
connect_timeout = 60
wait_timeout = 28800

# Buffer Settings
key_buffer_size = 32M
sort_buffer_size = 4M
read_buffer_size = 2M
read_rnd_buffer_size = 16M
myisam_sort_buffer_size = 128M
thread_cache_size = 16
tmp_table_size = 64M
max_heap_table_size = 64M

# Slow Query Log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
log_queries_not_using_indexes = 1
*/

-- ========================================
-- PERFORMANCE MONITORING QUERIES
-- ========================================

-- Query to check index usage
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    CARDINALITY,
    NULLABLE
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'procureflow'
ORDER BY TABLE_NAME, INDEX_NAME;

-- Query to identify slow operations
SELECT 
    TABLE_NAME,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS "DB Size in MB",
    TABLE_ROWS,
    ROUND((INDEX_LENGTH / 1024 / 1024), 2) AS "Index Size in MB"
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'procureflow'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- Performance analysis query
SELECT 
    t.TABLE_NAME,
    t.TABLE_ROWS,
    ROUND(((t.DATA_LENGTH + t.INDEX_LENGTH) / 1024 / 1024), 2) AS "Total Size MB",
    ROUND((t.DATA_LENGTH / 1024 / 1024), 2) AS "Data Size MB",
    ROUND((t.INDEX_LENGTH / 1024 / 1024), 2) AS "Index Size MB",
    ROUND((t.INDEX_LENGTH / t.DATA_LENGTH), 2) AS "Index Ratio"
FROM INFORMATION_SCHEMA.TABLES t
WHERE t.TABLE_SCHEMA = 'procureflow'
AND t.TABLE_TYPE = 'BASE TABLE'
ORDER BY "Total Size MB" DESC;
