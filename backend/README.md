# 🚀 ProcureFlow Backend - Java Spring Boot API

> **Smart Procurement Platform Backend Services - Built with Spring Boot 3.2, Java 17, and MySQL**

![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-green.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)
![JWT](https://img.shields.io/badge/JWT-Authentication-red.svg)

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📡 API Endpoints](#-api-endpoints)
- [🔐 Authentication](#-authentication)
- [💾 Database Schema](#-database-schema)
- [🧪 Testing](#-testing)
- [📖 API Documentation](#-api-documentation)
- [🔧 Configuration](#-configuration)

---

## 🌟 Features

### ✨ **Core Backend Features**

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Multi-level authorization (USER, MANAGER, ADMIN, PROCUREMENT, FINANCE)
- **RESTful API Design** - Clean, intuitive API endpoints
- **Pagination & Filtering** - Efficient data retrieval with search capabilities
- **Audit Trail** - Complete tracking of entity changes
- **Validation** - Comprehensive input validation using Bean Validation
- **Exception Handling** - Global exception handling with meaningful error messages

### 🔒 **Security Features**

- **JWT Token Security** - Stateless authentication
- **Password Encryption** - BCrypt password hashing
- **CORS Configuration** - Cross-origin resource sharing support
- **Method-Level Security** - Fine-grained access control
- **SQL Injection Protection** - Parameterized queries via JPA

### 📊 **Business Logic**

- **Purchase Request Management** - Full lifecycle management
- **Approval Workflow** - Multi-level approval process
- **Order Tracking** - Complete purchase order lifecycle
- **Statistics & Analytics** - Real-time dashboard data
- **User Management** - Comprehensive user administration

---

## 🏗️ Architecture

### **Technology Stack**

```
┌─────────────────┬──────────────────────────────────────┐
│ Layer           │ Technology                           │
├─────────────────┼──────────────────────────────────────┤
│ Framework       │ Spring Boot 3.2.1                   │
│ Language        │ Java 17                              │
│ Database        │ MySQL 8.0 / H2 (dev/test)          │
│ ORM             │ Spring Data JPA / Hibernate         │
│ Security        │ Spring Security + JWT                │
│ Documentation   │ Swagger/OpenAPI 3                   │
│ Build Tool      │ Maven 3.9+                          │
│ Testing         │ JUnit 5 + Testcontainers           │
└─────────────────┴──────────────────────────────────────┘
```

### **Project Structure**

```
backend/
├── src/main/java/com/procureflow/
│   ├── ProcureFlowApplication.java         # Main application class
│   ├── controller/                         # REST controllers
│   │   ├── AuthController.java            # Authentication endpoints
│   │   ├── PurchaseRequestController.java # Purchase request management
│   │   ├── ApprovalController.java        # Approval workflow
│   │   └── UserController.java            # User management
│   ├── service/                           # Business logic layer
│   │   ├── PurchaseRequestService.java
│   │   ├── UserService.java
│   │   └── impl/                          # Service implementations
│   ├── entity/                            # JPA entities
│   │   ├── User.java
│   │   ├── PurchaseRequest.java
│   │   ├── RequestItem.java
│   │   ├── Approval.java
│   │   └── PurchaseOrder.java
│   ├── repository/                        # Data access layer
│   │   ├── UserRepository.java
│   │   ├── PurchaseRequestRepository.java
│   │   └── ApprovalRepository.java
│   ├── dto/                              # Data transfer objects
│   │   ├── auth/                         # Authentication DTOs
│   │   └── request/                      # Request management DTOs
│   ├── security/                         # Security configuration
│   │   ├── WebSecurityConfig.java
│   │   ├── jwt/                          # JWT utilities
│   │   └── services/                     # Security services
│   └── config/                           # Application configuration
└── src/main/resources/
    ├── application.yml                   # Application properties
    ├── data.sql                         # Initial data
    └── static/                          # Static resources
```

---

## 🚀 Quick Start

### **Prerequisites**

- ☕ **Java 17+**
- 🛠️ **Maven 3.9+**
- 🐬 **MySQL 8.0+** (or use H2 for development)
- 🌐 **Git**

### **Installation & Setup**

```bash
# 1. Clone the repository
git clone <repository-url>
cd procureflow/backend

# 2. Configure database (MySQL)
mysql -u root -p
CREATE DATABASE procureflow;
# Update application.yml with your database credentials

# 3. Build the application
mvn clean install

# 4. Run the application
mvn spring-boot:run

# 5. Verify installation
curl http://localhost:8080/actuator/health
```

### **Quick Development Setup (H2 Database)**

```bash
# Run with development profile (uses H2 in-memory database)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Access H2 Console: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:procureflow
# Username: sa
# Password: (leave empty)
```

---

## 📡 API Endpoints

### **Authentication Endpoints**

```bash
POST   /api/auth/signin          # User login
POST   /api/auth/signup          # User registration
GET    /api/auth/validate        # Token validation
```

### **Purchase Request Management**

```bash
GET    /api/purchase-requests              # Get all requests (paginated)
GET    /api/purchase-requests/{id}         # Get request by ID
POST   /api/purchase-requests              # Create new request
PUT    /api/purchase-requests/{id}         # Update request
DELETE /api/purchase-requests/{id}         # Delete request
PUT    /api/purchase-requests/{id}/status  # Update status
PUT    /api/purchase-requests/{id}/assign  # Assign request
GET    /api/purchase-requests/my-requests  # Get current user's requests
GET    /api/purchase-requests/pending-approval # Get pending approvals
GET    /api/purchase-requests/statistics   # Get statistics
```

### **Query Parameters (Purchase Requests)**

```bash
# Pagination
?page=0&size=10&sortBy=createdAt&sortDir=desc

# Filtering
?status=PENDING&department=IT&priority=HIGH

# Search
?search=laptop
```

### **User Management**

```bash
GET    /api/users                    # Get all users
GET    /api/users/{id}               # Get user by ID
PUT    /api/users/{id}               # Update user
GET    /api/users/profile            # Get current user profile
PUT    /api/users/profile            # Update current user profile
```

---

## 🔐 Authentication

### **Login Request**

```json
POST /api/auth/signin
{
  "usernameOrEmail": "demo@procureflow.com",
  "password": "demo123"
}
```

### **Login Response**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "demo",
  "email": "demo@procureflow.com",
  "firstName": "Demo",
  "lastName": "User",
  "department": "IT",
  "roles": ["ROLE_USER"]
}
```

### **Using JWT Token**

```bash
# Include in Authorization header
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

# Example API call
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/api/purchase-requests
```

---

## 💾 Database Schema

### **Core Entities**

```sql
-- Users table
users (
  id BIGINT PRIMARY KEY,
  username VARCHAR(20) UNIQUE,
  email VARCHAR(50) UNIQUE,
  password VARCHAR(120),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  department VARCHAR(50),
  position VARCHAR(50),
  phone VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Purchase Requests table
purchase_requests (
  id BIGINT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  department VARCHAR(50),
  priority ENUM('LOW','MEDIUM','HIGH','URGENT'),
  status ENUM('PENDING','UNDER_REVIEW','APPROVED','REJECTED',...),
  total_amount DECIMAL(10,2),
  justification TEXT,
  expected_delivery_date TIMESTAMP,
  requested_by BIGINT,
  assigned_to BIGINT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Request Items table
request_items (
  id BIGINT PRIMARY KEY,
  item_name VARCHAR(255),
  description TEXT,
  quantity INTEGER,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  specifications TEXT,
  preferred_supplier VARCHAR(255),
  purchase_request_id BIGINT
)
```

### **Demo Data**

The application includes comprehensive demo data:

- **5 Demo Users** with different roles
- **5 Sample Purchase Requests** in various states
- **Multiple Request Items** per request
- **Sample Approvals** and workflow data
- **Purchase Orders** for approved requests

**Demo Credentials:**

```
Username: demo@procureflow.com
Password: demo123
(Note: All demo users use the same password for simplicity)
```

---

## 🧪 Testing

### **Running Tests**

```bash
# Run all tests
mvn test

# Run with coverage report
mvn test jacoco:report

# Run integration tests
mvn test -Dtest="*IT"

# Run specific test class
mvn test -Dtest="UserServiceTest"
```

### **Test Profiles**

```bash
# Use test profile (H2 database)
mvn test -Dspring.profiles.active=test

# Run with testcontainers (real MySQL)
mvn test -Dspring.profiles.active=testcontainers
```

---

## 📖 API Documentation

### **Swagger UI**

- **URL**: http://localhost:8080/swagger-ui/index.html
- **Features**: Interactive API documentation
- **Testing**: Direct API testing from browser

### **OpenAPI Specification**

- **JSON**: http://localhost:8080/v3/api-docs
- **YAML**: http://localhost:8080/v3/api-docs.yaml

### **Sample API Requests**

#### Create Purchase Request

```json
POST /api/purchase-requests
{
  "title": "Office Supplies",
  "description": "Monthly office supply order",
  "department": "Administration",
  "priority": "MEDIUM",
  "totalAmount": 500.00,
  "justification": "Regular monthly supplies",
  "expectedDeliveryDate": "2024-02-15T10:00:00",
  "items": [
    {
      "itemName": "Printer Paper",
      "description": "A4 size, 500 sheets per pack",
      "quantity": 10,
      "unitPrice": 25.00,
      "specifications": "80gsm, white",
      "preferredSupplier": "Office Depot"
    }
  ]
}
```

---

## 🔧 Configuration

### **Application Profiles**

#### **Development Profile** (`dev`)

```yaml
spring:
  profiles: dev
  datasource:
    url: jdbc:h2:mem:procureflow
  jpa:
    show-sql: true
```

#### **Production Profile** (`prod`)

```yaml
spring:
  profiles: prod
  datasource:
    url: jdbc:mysql://prod-db:3306/procureflow
  jpa:
    show-sql: false
```

### **Environment Variables**

```bash
# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=procureflow
MYSQL_USERNAME=root
MYSQL_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# Mail Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### **Custom Properties**

```yaml
procureflow:
  app:
    jwtSecret: ${JWT_SECRET:procureFlowSecretKey2024}
    jwtExpirationMs: ${JWT_EXPIRATION:86400000}
```

---

## 🚀 Deployment

### **Docker Support**

```dockerfile
# Dockerfile
FROM openjdk:17-jdk-slim
COPY target/procureflow-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

```bash
# Build and run with Docker
mvn clean package
docker build -t procureflow-backend .
docker run -p 8080:8080 procureflow-backend
```

### **Production Deployment**

```bash
# Build for production
mvn clean package -Pprod

# Run with production profile
java -jar -Dspring.profiles.active=prod target/procureflow-backend-1.0.0.jar
```

---

## 📊 Monitoring & Metrics

### **Health Checks**

- **Health**: http://localhost:8080/actuator/health
- **Info**: http://localhost:8080/actuator/info
- **Metrics**: http://localhost:8080/actuator/metrics

### **Logging**

```bash
# Application logs
tail -f logs/procureflow.log

# Database queries (dev profile)
# SQL queries are logged with parameters
```

---

## 🤝 API Integration with Frontend

### **Frontend Integration**

The backend is designed to work seamlessly with the React frontend:

```javascript
// Frontend API configuration
const API_BASE_URL = "http://localhost:8080/api";

// Authentication
const authResponse = await fetch(`${API_BASE_URL}/auth/signin`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    usernameOrEmail: "demo@procureflow.com",
    password: "demo123",
  }),
});

// Authenticated requests
const requestsResponse = await fetch(`${API_BASE_URL}/purchase-requests`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## 🎯 Next Steps

### **Planned Enhancements**

- 📧 **Email Notifications** - Automated workflow notifications
- 📱 **Mobile API** - Optimized endpoints for mobile apps
- 🔄 **Workflow Engine** - Advanced approval workflows
- 📊 **Advanced Analytics** - Business intelligence features
- 🌐 **Multi-tenant Support** - Organization isolation
- 🔐 **OAuth2 Integration** - Social login support

---

## 📞 Support & Development

### **Development Commands**

```bash
# Code formatting
mvn spring-javaformat:apply

# Security audit
mvn org.owasp:dependency-check-maven:check

# Performance testing
mvn gatling:test

# Database migration
mvn flyway:migrate
```

### **Troubleshooting**

- **Port conflicts**: Change server.port in application.yml
- **Database issues**: Check MySQL service and credentials
- **JWT errors**: Verify JWT secret configuration
- **CORS issues**: Update CORS configuration in WebSecurityConfig

---

<div align="center">

### 🚀 **ProcureFlow Backend - Production Ready!**

**[Quick Start](#-quick-start)** · **[API Docs](http://localhost:8080/swagger-ui/index.html)** · **[Health Check](http://localhost:8080/actuator/health)**

---

**Built with ❤️ using Spring Boot, Java 17, and modern enterprise patterns**

_Secure, scalable, and production-ready backend services_

</div>
