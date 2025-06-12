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

-- Insert Sample Purchase Requests (Indian Rupee amounts)
INSERT INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Office Laptops', 'New laptops for development team', 'IT', 'HIGH', 'PENDING', 1250000.00, 'Current laptops are outdated and affecting productivity', DATE_ADD(NOW(), INTERVAL 2 WEEK), 2, NOW(), NOW());

INSERT INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Conference Room Equipment', 'Projector and audio system for main conference room', 'IT', 'MEDIUM', 'APPROVED', 290000.00, 'Needed for client presentations and team meetings', DATE_ADD(NOW(), INTERVAL 1 MONTH), 2, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());

INSERT INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Office Furniture', 'Ergonomic chairs and standing desks', 'HR', 'LOW', 'UNDER_REVIEW', 705000.00, 'Improving employee comfort and health', DATE_ADD(NOW(), INTERVAL 3 WEEK), 3, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

INSERT INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Software Licenses', 'Annual renewal of development tools', 'IT', 'URGENT', 'APPROVED', 995000.00, 'Critical software licenses expiring soon', DATE_ADD(NOW(), INTERVAL 1 WEEK), 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW());

INSERT INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Marketing Materials', 'Brochures and promotional items for trade show', 'Marketing', 'MEDIUM', 'PENDING', 207500.00, 'Upcoming trade show participation', DATE_ADD(NOW(), INTERVAL 2 WEEK), 1, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- Insert Request Items (Indian Rupee prices)
INSERT INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('MacBook Pro 16"', 'Apple MacBook Pro 16-inch with M2 chip', 10, 207500.00, 2075000.00, 'M2 chip, 16GB RAM, 512GB SSD', 'Apple India', 1);

INSERT INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Wireless Mouse', 'Apple Magic Mouse', 10, 6650.00, 66500.00, 'Wireless, rechargeable', 'Apple India', 1);

INSERT INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('4K Projector', 'High-resolution projector for presentations', 1, 207500.00, 207500.00, '4K resolution, 3500 lumens', 'BenQ India', 2);

INSERT INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Audio System', 'Conference room audio system', 1, 83000.00, 83000.00, 'Wireless microphones, speakers', 'Bose India', 2);

INSERT INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Ergonomic Chair', 'Herman Miller Aeron chair', 15, 37375.00, 560625.00, 'Size B, fully adjustable', 'Herman Miller India', 3);

INSERT INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Standing Desk', 'Height adjustable standing desk', 8, 53950.00, 431600.00, 'Electric height adjustment', 'IKEA India', 3);

-- Insert Sample Approvals
INSERT INTO approvals(status, comments, purchase_request_id, approver_id, approval_level, created_at, updated_at)
VALUES('APPROVED', 'Approved for immediate purchase. Critical for team productivity.', 2, 3, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO approvals(status, comments, purchase_request_id, approver_id, approval_level, created_at, updated_at)
VALUES('APPROVED', 'License renewal is critical. Approved for immediate processing.', 4, 5, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY));

INSERT INTO approvals(status, comments, purchase_request_id, approver_id, approval_level, created_at, updated_at)
VALUES('PENDING', 'Under review for budget approval.', 3, 5, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Insert Sample Purchase Orders (Indian Rupee amounts)
INSERT INTO purchase_orders(order_number, status, total_amount, supplier_name, supplier_contact, supplier_email, delivery_address, expected_delivery_date, notes, purchase_request_id, created_by, created_at, updated_at)
VALUES('PO-1001', 'CONFIRMED', 290000.00, 'TechCorp Solutions India', 'Rajesh Kumar', 'rajesh@techcorp.in', 'ProcureFlow Technologies Pvt Ltd\nIT Department\nPlot No. 123, Sector 18\nGurgaon, Haryana 122015\nIndia', DATE_ADD(NOW(), INTERVAL 1 MONTH), 'Rush delivery requested', 2, 3, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

INSERT INTO purchase_orders(order_number, status, total_amount, supplier_name, supplier_contact, supplier_email, delivery_address, expected_delivery_date, notes, purchase_request_id, created_by, created_at, updated_at)
VALUES('PO-1002', 'SENT', 995000.00, 'Microsoft India Pvt Ltd', 'Priya Sharma', 'licenses@microsoft.in', 'ProcureFlow Technologies Pvt Ltd\nIT Department\nPlot No. 123, Sector 18\nGurgaon, Haryana 122015\nIndia', DATE_ADD(NOW(), INTERVAL 1 WEEK), 'Annual license renewal', 4, 4, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());
