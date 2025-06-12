-- Initial data for ProcureFlow application

-- Insert Roles
INSERT INTO roles(name, description) VALUES('ROLE_USER', 'Regular user role - can create and manage own requests');
INSERT INTO roles(name, description) VALUES('ROLE_MANAGER', 'Manager role - can approve requests and manage team');
INSERT INTO roles(name, description) VALUES('ROLE_ADMIN', 'Administrator role - full system access');
INSERT INTO roles(name, description) VALUES('ROLE_PROCUREMENT', 'Procurement specialist - manages procurement process');
INSERT INTO roles(name, description) VALUES('ROLE_FINANCE', 'Finance team member - handles financial aspects');

-- Insert Demo Users
INSERT INTO users(username, email, password, first_name, last_name, department, position, phone, is_active, created_at, updated_at) 
VALUES('demo', 'demo@procureflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Demo', 'User', 'IT', 'Software Engineer', '+1-555-0123', true, NOW(), NOW());

INSERT INTO users(username, email, password, first_name, last_name, department, position, phone, is_active, created_at, updated_at) 
VALUES('john.doe', 'john.doe@procureflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'John', 'Doe', 'IT', 'Senior Developer', '+1-555-0124', true, NOW(), NOW());

INSERT INTO users(username, email, password, first_name, last_name, department, position, phone, is_active, created_at, updated_at) 
VALUES('jane.smith', 'jane.smith@procureflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Jane', 'Smith', 'HR', 'HR Manager', '+1-555-0125', true, NOW(), NOW());

INSERT INTO users(username, email, password, first_name, last_name, department, position, phone, is_active, created_at, updated_at) 
VALUES('admin', 'admin@procureflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'System', 'Administrator', 'IT', 'System Admin', '+1-555-0100', true, NOW(), NOW());

INSERT INTO users(username, email, password, first_name, last_name, department, position, phone, is_active, created_at, updated_at) 
VALUES('mike.johnson', 'mike.johnson@procureflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Mike', 'Johnson', 'Finance', 'Finance Manager', '+1-555-0126', true, NOW(), NOW());

-- Assign Roles to Users
INSERT INTO user_roles(user_id, role_id) VALUES(1, 1); -- demo user
INSERT INTO user_roles(user_id, role_id) VALUES(2, 1); -- john.doe user
INSERT INTO user_roles(user_id, role_id) VALUES(2, 2); -- john.doe manager
INSERT INTO user_roles(user_id, role_id) VALUES(3, 2); -- jane.smith manager
INSERT INTO user_roles(user_id, role_id) VALUES(4, 3); -- admin
INSERT INTO user_roles(user_id, role_id) VALUES(5, 2); -- mike.johnson manager
INSERT INTO user_roles(user_id, role_id) VALUES(5, 5); -- mike.johnson finance

-- Insert Sample Purchase Requests
INSERT INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Office Laptops', 'New laptops for development team', 'IT', 'HIGH', 'PENDING', 15000.00, 'Current laptops are outdated and affecting productivity', DATE_ADD(NOW(), INTERVAL 2 WEEK), 2, NOW(), NOW());

INSERT INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Conference Room Equipment', 'Projector and audio system for main conference room', 'IT', 'MEDIUM', 'APPROVED', 3500.00, 'Needed for client presentations and team meetings', DATE_ADD(NOW(), INTERVAL 1 MONTH), 2, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());

INSERT INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Office Furniture', 'Ergonomic chairs and standing desks', 'HR', 'LOW', 'UNDER_REVIEW', 8500.00, 'Improving employee comfort and health', DATE_ADD(NOW(), INTERVAL 3 WEEK), 3, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

INSERT INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Software Licenses', 'Annual renewal of development tools', 'IT', 'URGENT', 'APPROVED', 12000.00, 'Critical software licenses expiring soon', DATE_ADD(NOW(), INTERVAL 1 WEEK), 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW());

INSERT INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Marketing Materials', 'Brochures and promotional items for trade show', 'Marketing', 'MEDIUM', 'PENDING', 2500.00, 'Upcoming trade show participation', DATE_ADD(NOW(), INTERVAL 2 WEEK), 1, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- Insert Request Items
INSERT INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('MacBook Pro 16"', 'Apple MacBook Pro 16-inch with M2 chip', 10, 2500.00, 25000.00, 'M2 chip, 16GB RAM, 512GB SSD', 'Apple Store', 1);

INSERT INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Wireless Mouse', 'Apple Magic Mouse', 10, 80.00, 800.00, 'Wireless, rechargeable', 'Apple Store', 1);

INSERT INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('4K Projector', 'High-resolution projector for presentations', 1, 2500.00, 2500.00, '4K resolution, 3500 lumens', 'BenQ', 2);

INSERT INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Audio System', 'Conference room audio system', 1, 1000.00, 1000.00, 'Wireless microphones, speakers', 'Bose', 2);

INSERT INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Ergonomic Chair', 'Herman Miller Aeron chair', 15, 450.00, 6750.00, 'Size B, fully adjustable', 'Herman Miller', 3);

INSERT INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Standing Desk', 'Height adjustable standing desk', 8, 650.00, 5200.00, 'Electric height adjustment', 'IKEA', 3);

-- Insert Sample Approvals
INSERT INTO approvals(status, comments, purchase_request_id, approver_id, approval_level, created_at, updated_at)
VALUES('APPROVED', 'Approved for immediate purchase. Critical for team productivity.', 2, 3, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO approvals(status, comments, purchase_request_id, approver_id, approval_level, created_at, updated_at)
VALUES('APPROVED', 'License renewal is critical. Approved for immediate processing.', 4, 5, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY));

INSERT INTO approvals(status, comments, purchase_request_id, approver_id, approval_level, created_at, updated_at)
VALUES('PENDING', 'Under review for budget approval.', 3, 5, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Insert Sample Purchase Orders
INSERT INTO purchase_orders(order_number, status, total_amount, supplier_name, supplier_contact, supplier_email, delivery_address, expected_delivery_date, notes, purchase_request_id, created_by, created_at, updated_at)
VALUES('PO-1001', 'CONFIRMED', 3500.00, 'TechCorp Solutions', 'John Sales', 'john@techcorp.com', '123 Business Ave, Tech City, TC 12345', DATE_ADD(NOW(), INTERVAL 1 MONTH), 'Rush delivery requested', 2, 3, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

INSERT INTO purchase_orders(order_number, status, total_amount, supplier_name, supplier_contact, supplier_email, delivery_address, expected_delivery_date, notes, purchase_request_id, created_by, created_at, updated_at)
VALUES('PO-1002', 'SENT', 12000.00, 'Software Solutions Inc', 'License Team', 'licenses@softwaresolutions.com', '123 Business Ave, Tech City, TC 12345', DATE_ADD(NOW(), INTERVAL 1 WEEK), 'Annual license renewal', 4, 4, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());
