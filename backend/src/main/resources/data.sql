-- Optimized MySQL Schema for ProcureFlow
-- All amounts in Indian Rupees (₹)

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchase_requests_status ON purchase_requests(status);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_department ON purchase_requests(department);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_priority ON purchase_requests(priority);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_created_at ON purchase_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_requested_by ON purchase_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_assigned_to ON purchase_requests(assigned_to);

CREATE INDEX IF NOT EXISTS idx_request_items_purchase_request_id ON request_items(purchase_request_id);
CREATE INDEX IF NOT EXISTS idx_approvals_purchase_request_id ON approvals(purchase_request_id);
CREATE INDEX IF NOT EXISTS idx_approvals_approver_id ON approvals(approver_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_request_id ON purchase_orders(purchase_request_id);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Insert Roles
INSERT IGNORE INTO roles(name, description) VALUES('ROLE_USER', 'Regular user role - can create and manage own requests');
INSERT IGNORE INTO roles(name, description) VALUES('ROLE_MANAGER', 'Manager role - can approve requests and manage team');
INSERT IGNORE INTO roles(name, description) VALUES('ROLE_ADMIN', 'Administrator role - full system access');
INSERT IGNORE INTO roles(name, description) VALUES('ROLE_PROCUREMENT', 'Procurement specialist - manages procurement process');
INSERT IGNORE INTO roles(name, description) VALUES('ROLE_FINANCE', 'Finance team member - handles financial aspects');

-- Insert Demo Users with real Indian names and departments
INSERT IGNORE INTO users(username, email, password, first_name, last_name, department, position, phone, is_active, created_at, updated_at) 
VALUES('demo', 'demo@procureflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rajesh', 'Kumar', 'IT', 'Software Engineer', '+91-9876543210', true, NOW(), NOW());

INSERT IGNORE INTO users(username, email, password, first_name, last_name, department, position, phone, is_active, created_at, updated_at) 
VALUES('priya.sharma', 'priya.sharma@procureflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Priya', 'Sharma', 'IT', 'Senior Developer', '+91-9876543211', true, NOW(), NOW());

INSERT IGNORE INTO users(username, email, password, first_name, last_name, department, position, phone, is_active, created_at, updated_at) 
VALUES('amit.singh', 'amit.singh@procureflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Amit', 'Singh', 'HR', 'HR Manager', '+91-9876543212', true, NOW(), NOW());

INSERT IGNORE INTO users(username, email, password, first_name, last_name, department, position, phone, is_active, created_at, updated_at) 
VALUES('admin', 'admin@procureflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'System', 'Administrator', 'IT', 'System Admin', '+91-9876543200', true, NOW(), NOW());

INSERT IGNORE INTO users(username, email, password, first_name, last_name, department, position, phone, is_active, created_at, updated_at) 
VALUES('neha.gupta', 'neha.gupta@procureflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Neha', 'Gupta', 'Finance', 'Finance Manager', '+91-9876543213', true, NOW(), NOW());

INSERT IGNORE INTO users(username, email, password, first_name, last_name, department, position, phone, is_active, created_at, updated_at) 
VALUES('rohit.verma', 'rohit.verma@procureflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rohit', 'Verma', 'Operations', 'Operations Manager', '+91-9876543214', true, NOW(), NOW());

INSERT IGNORE INTO users(username, email, password, first_name, last_name, department, position, phone, is_active, created_at, updated_at) 
VALUES('kavya.reddy', 'kavya.reddy@procureflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Kavya', 'Reddy', 'Marketing', 'Marketing Manager', '+91-9876543215', true, NOW(), NOW());

-- Assign Roles to Users
INSERT IGNORE INTO user_roles(user_id, role_id) VALUES(1, 1); -- demo user
INSERT IGNORE INTO user_roles(user_id, role_id) VALUES(2, 1); -- priya.sharma user
INSERT IGNORE INTO user_roles(user_id, role_id) VALUES(2, 2); -- priya.sharma manager
INSERT IGNORE INTO user_roles(user_id, role_id) VALUES(3, 2); -- amit.singh manager
INSERT IGNORE INTO user_roles(user_id, role_id) VALUES(4, 3); -- admin
INSERT IGNORE INTO user_roles(user_id, role_id) VALUES(5, 2); -- neha.gupta manager
INSERT IGNORE INTO user_roles(user_id, role_id) VALUES(5, 5); -- neha.gupta finance
INSERT IGNORE INTO user_roles(user_id, role_id) VALUES(6, 2); -- rohit.verma manager
INSERT IGNORE INTO user_roles(user_id, role_id) VALUES(7, 2); -- kavya.reddy manager

-- Insert Realistic Purchase Requests (All amounts in Indian Rupees ₹)
INSERT IGNORE INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Dell Laptops for Development Team', 'New Dell Inspiron laptops for software development team', 'IT', 'HIGH', 'PENDING', 875000.00, 'Current laptops are outdated and affecting productivity. Need latest specs for development work.', DATE_ADD(NOW(), INTERVAL 2 WEEK), 2, NOW(), NOW());

INSERT IGNORE INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Conference Room Setup', 'Smart TV, projector and audio system for main conference room', 'IT', 'MEDIUM', 'APPROVED', 235000.00, 'Required for client presentations and virtual meetings with international teams.', DATE_ADD(NOW(), INTERVAL 1 MONTH), 2, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());

INSERT IGNORE INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Herman Miller Office Furniture', 'Ergonomic chairs and height-adjustable desks', 'HR', 'LOW', 'UNDER_REVIEW', 654000.00, 'Improving employee health and productivity with ergonomic workplace setup.', DATE_ADD(NOW(), INTERVAL 3 WEEK), 3, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

INSERT IGNORE INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Microsoft Office 365 Licenses', 'Annual renewal of Microsoft Office 365 Business Premium', 'IT', 'URGENT', 'APPROVED', 485000.00, 'Critical software licenses expiring in 15 days. Immediate renewal required.', DATE_ADD(NOW(), INTERVAL 1 WEEK), 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW());

INSERT IGNORE INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Marketing Campaign Materials', 'Brochures, banners and promotional items for Q4 campaign', 'Marketing', 'MEDIUM', 'PENDING', 125000.00, 'Q4 marketing campaign launch requires professional printed materials and promotional items.', DATE_ADD(NOW(), INTERVAL 2 WEEK), 7, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

INSERT IGNORE INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Server Infrastructure Upgrade', 'AWS cloud servers and networking equipment', 'IT', 'HIGH', 'IN_PROGRESS', 1250000.00, 'Current infrastructure reaching capacity limits. Upgrade needed for scalability.', DATE_ADD(NOW(), INTERVAL 6 WEEK), 2, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW());

INSERT IGNORE INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Employee Training Programs', 'Professional development and certification courses', 'HR', 'MEDIUM', 'APPROVED', 320000.00, 'Upskilling employees with latest technology certifications and soft skills training.', DATE_ADD(NOW(), INTERVAL 8 WEEK), 3, DATE_SUB(NOW(), INTERVAL 4 DAY), NOW());

INSERT IGNORE INTO purchase_requests(title, description, department, priority, status, total_amount, justification, expected_delivery_date, requested_by, created_at, updated_at)
VALUES('Accounting Software License', 'Tally Prime multi-user license for finance team', 'Finance', 'HIGH', 'COMPLETED', 185000.00, 'Upgrade from Tally ERP to Tally Prime for better GST compliance and reporting.', DATE_SUB(NOW(), INTERVAL 1 WEEK), 5, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Insert Request Items (All prices in Indian Rupees ₹)
INSERT IGNORE INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Dell Inspiron 15 3000', 'Dell laptop with Intel i5, 8GB RAM, 512GB SSD', 7, 65000.00, 455000.00, 'Intel i5-1135G7, 8GB DDR4, 512GB SSD, 15.6" FHD Display', 'Dell India', 1);

INSERT IGNORE INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Laptop Bags', 'Professional laptop carrying bags', 7, 2500.00, 17500.00, 'Padded, water-resistant, fits 15.6" laptops', 'Amazon Business', 1);

INSERT IGNORE INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Wireless Mouse', 'Dell wireless optical mouse', 7, 1500.00, 10500.00, 'Wireless, ergonomic design, USB receiver', 'Dell India', 1);

INSERT IGNORE INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Samsung Smart TV 65"', 'Samsung 65-inch 4K Smart TV for presentations', 1, 125000.00, 125000.00, '65" 4K UHD, Smart TV, Multiple HDMI ports', 'Samsung India', 2);

INSERT IGNORE INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('BenQ Projector', 'BenQ 4K projector for large presentations', 1, 85000.00, 85000.00, '4K resolution, 3000 lumens, HDR support', 'BenQ India', 2);

INSERT IGNORE INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Audio System', 'JBL conference room audio system', 1, 25000.00, 25000.00, 'Wireless microphones, ceiling speakers, mixer', 'JBL Professional', 2);

INSERT IGNORE INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Herman Miller Aeron Chair', 'Ergonomic office chair with lumbar support', 12, 45000.00, 540000.00, 'Size B, fully adjustable, 12-year warranty', 'Herman Miller India', 3);

INSERT IGNORE INTO request_items(item_name, description, quantity, unit_price, total_price, specifications, preferred_supplier, purchase_request_id)
VALUES('Height Adjustable Desk', 'Electric sit-stand desk', 6, 38000.00, 228000.00, 'Electric height adjustment, 120x80cm surface', 'Godrej Interio', 3);

-- Insert Sample Approvals
INSERT IGNORE INTO approvals(status, comments, purchase_request_id, approver_id, approval_level, created_at, updated_at)
VALUES('APPROVED', 'Approved for immediate purchase. Conference room upgrade is essential for business operations.', 2, 3, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT IGNORE INTO approvals(status, comments, purchase_request_id, approver_id, approval_level, created_at, updated_at)
VALUES('APPROVED', 'License renewal is critical for business continuity. Approved for immediate processing.', 4, 5, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY));

INSERT IGNORE INTO approvals(status, comments, purchase_request_id, approver_id, approval_level, created_at, updated_at)
VALUES('PENDING', 'Under review for budget approval. Need finance team review for furniture procurement.', 3, 5, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT IGNORE INTO approvals(status, comments, purchase_request_id, approver_id, approval_level, created_at, updated_at)
VALUES('APPROVED', 'Training budget approved. Important for team skill development and retention.', 7, 3, 1, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY));

INSERT IGNORE INTO approvals(status, comments, purchase_request_id, approver_id, approval_level, created_at, updated_at)
VALUES('APPROVED', 'Tally Prime upgrade approved. Essential for GST compliance and financial reporting.', 8, 5, 1, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY));

-- Insert Sample Purchase Orders (All amounts in Indian Rupees ₹)
INSERT IGNORE INTO purchase_orders(order_number, status, total_amount, supplier_name, supplier_contact, supplier_email, delivery_address, expected_delivery_date, notes, purchase_request_id, created_by, created_at, updated_at)
VALUES('PO-2024-001', 'CONFIRMED', 235000.00, 'Samsung India Electronics Pvt Ltd', 'Rajesh Kumar', 'rajesh.kumar@samsung.com', 'ProcureFlow Technologies Pvt Ltd\nIT Department\nPlot No. 123, Sector 18\nGurgaon, Haryana 122015\nIndia', DATE_ADD(NOW(), INTERVAL 3 WEEK), 'Conference room setup - priority delivery requested', 2, 3, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

INSERT IGNORE INTO purchase_orders(order_number, status, total_amount, supplier_name, supplier_contact, supplier_email, delivery_address, expected_delivery_date, notes, purchase_request_id, created_by, created_at, updated_at)
VALUES('PO-2024-002', 'IN_TRANSIT', 485000.00, 'Microsoft India Pvt Ltd', 'Priya Sharma', 'enterprise.sales@microsoft.in', 'ProcureFlow Technologies Pvt Ltd\nIT Department\nPlot No. 123, Sector 18\nGurgaon, Haryana 122015\nIndia', DATE_ADD(NOW(), INTERVAL 1 WEEK), 'Office 365 license renewal - urgent requirement', 4, 4, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());

INSERT IGNORE INTO purchase_orders(order_number, status, total_amount, supplier_name, supplier_contact, supplier_email, delivery_address, expected_delivery_date, notes, purchase_request_id, created_by, created_at, updated_at)
VALUES('PO-2024-003', 'DELIVERED', 185000.00, 'Tally Solutions Pvt Ltd', 'Amit Singh', 'enterprise@tallysolutions.com', 'ProcureFlow Technologies Pvt Ltd\nFinance Department\nPlot No. 123, Sector 18\nGurgaon, Haryana 122015\nIndia', DATE_SUB(NOW(), INTERVAL 1 WEEK), 'Tally Prime multi-user license - delivered and installed', 8, 5, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY));

INSERT IGNORE INTO purchase_orders(order_number, status, total_amount, supplier_name, supplier_contact, supplier_email, delivery_address, expected_delivery_date, notes, purchase_request_id, created_by, created_at, updated_at)
VALUES('PO-2024-004', 'CONFIRMED', 320000.00, 'NIIT Technologies Ltd', 'Neha Gupta', 'corporate.training@niit.com', 'ProcureFlow Technologies Pvt Ltd\nHR Department\nPlot No. 123, Sector 18\nGurgaon, Haryana 122015\nIndia', DATE_ADD(NOW(), INTERVAL 6 WEEK), 'Employee training programs - batch scheduling in progress', 7, 3, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW());

-- Performance optimization: Update table statistics
ANALYZE TABLE users;
ANALYZE TABLE purchase_requests;
ANALYZE TABLE request_items;
ANALYZE TABLE approvals;
ANALYZE TABLE purchase_orders;
ANALYZE TABLE roles;
ANALYZE TABLE user_roles;
