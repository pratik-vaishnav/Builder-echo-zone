package com.procureflow.controller;

import com.procureflow.dto.request.PurchaseRequestDTO;
import com.procureflow.entity.Priority;
import com.procureflow.entity.RequestStatus;
import com.procureflow.repository.jdbc.PurchaseRequestJdbcRepository;
import com.procureflow.service.impl.PurchaseRequestJdbcService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Optimized Purchase Request Controller using JDBC Template
 * High-performance REST API endpoints with direct SQL queries
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/purchase-requests")
@Tag(name = "Purchase Requests (JDBC)", description = "High-performance purchase request management APIs using JDBC Template")
public class PurchaseRequestJdbcController {

    @Autowired
    private PurchaseRequestJdbcRepository purchaseRequestRepository;

    @Autowired
    private PurchaseRequestJdbcService purchaseRequestService;

    /**
     * Get paginated purchase requests with optimized SQL
     */
    @GetMapping
    @Operation(summary = "Get paginated purchase requests", description = "Retrieve paginated list with optimized JDBC queries")
    public ResponseEntity<Map<String, Object>> getAllRequests(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "created_at") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir,
            @Parameter(description = "Filter by status") @RequestParam(required = false) RequestStatus status,
            @Parameter(description = "Filter by department") @RequestParam(required = false) String department,
            @Parameter(description = "Filter by priority") @RequestParam(required = false) Priority priority,
            @Parameter(description = "Search term") @RequestParam(required = false) String search) {

        try {
            List<PurchaseRequestDTO> requests;
            long totalElements;

            if (search != null && !search.trim().isEmpty()) {
                requests = purchaseRequestRepository.searchRequests(search, page, size);
                totalElements = purchaseRequestRepository.getTotalCount(); // Simplified for search
            } else if (status != null || department != null || priority != null) {
                requests = purchaseRequestRepository.findByMultipleCriteria(status, department, priority, null, page, size);
                totalElements = purchaseRequestRepository.getTotalCount();
            } else {
                requests = purchaseRequestRepository.findPaginated(page, size, sortBy, sortDir);
                totalElements = purchaseRequestRepository.getTotalCount();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("content", requests);
            response.put("totalElements", totalElements);
            response.put("totalPages", (int) Math.ceil((double) totalElements / size));
            response.put("size", size);
            response.put("number", page);
            response.put("first", page == 0);
            response.put("last", page >= Math.ceil((double) totalElements / size) - 1);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch purchase requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get purchase request statistics with single optimized query
     */
    @GetMapping("/statistics")
    @Operation(summary = "Get purchase request statistics", description = "Retrieve comprehensive statistics with optimized JDBC query")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        try {
            Map<String, Object> statistics = purchaseRequestRepository.getStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get pending approvals with optimized priority ordering
     */
    @GetMapping("/pending-approval")
    @Operation(summary = "Get pending approvals", description = "Retrieve requests pending approval ordered by priority")
    public ResponseEntity<List<PurchaseRequestDTO>> getPendingApprovals(
            @Parameter(description = "Limit number of results") @RequestParam(defaultValue = "20") int limit) {
        try {
            List<PurchaseRequestDTO> pendingRequests = purchaseRequestRepository.findPendingApprovals(limit);
            return ResponseEntity.ok(pendingRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get department breakdown for analytics
     */
    @GetMapping("/departments")
    @Operation(summary = "Get department breakdown", description = "Retrieve request count and amount by department")
    public ResponseEntity<List<Map<String, Object>>> getDepartmentBreakdown() {
        try {
            List<Map<String, Object>> breakdown = purchaseRequestRepository.getDepartmentBreakdown();
            return ResponseEntity.ok(breakdown);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get recent activity for dashboard
     */
    @GetMapping("/recent-activity")
    @Operation(summary = "Get recent activity", description = "Retrieve recent purchase request activity")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity(
            @Parameter(description = "Limit number of results") @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Map<String, Object>> activity = purchaseRequestRepository.getRecentActivity(limit);
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Create new purchase request
     */
    @PostMapping
    @Operation(summary = "Create purchase request", description = "Create a new purchase request with optimized insertion")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> createRequest(@Valid @RequestBody PurchaseRequestDTO requestDTO) {
        try {
            // Get current user ID from security context
            Long currentUserId = getCurrentUserId();
            
            Long requestId = purchaseRequestRepository.createPurchaseRequest(requestDTO, currentUserId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", requestId);
            response.put("message", "Purchase request created successfully");
            response.put("requestNumber", "PR-" + String.format("%06d", requestId));
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create purchase request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Update request status
     */
    @PutMapping("/{id}/status")
    @Operation(summary = "Update request status", description = "Update purchase request status with optimized query")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus status) {
        try {
            purchaseRequestRepository.updateStatus(id, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Status updated successfully");
            response.put("newStatus", status);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get user's own requests
     */
    @GetMapping("/my-requests")
    @Operation(summary = "Get user's requests", description = "Retrieve current user's purchase requests")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> getMyRequests(
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "created_at") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Long currentUserId = getCurrentUserId();
            
            List<PurchaseRequestDTO> requests = purchaseRequestRepository.findByMultipleCriteria(
                null, null, null, currentUserId, page, size);
            long totalElements = purchaseRequestRepository.getTotalCount();

            Map<String, Object> response = new HashMap<>();
            response.put("content", requests);
            response.put("totalElements", totalElements);
            response.put("totalPages", (int) Math.ceil((double) totalElements / size));
            response.put("size", size);
            response.put("number", page);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch user requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get request by ID (optimized single query)
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get request by ID", description = "Retrieve single purchase request with optimized query")
    public ResponseEntity<PurchaseRequestDTO> getRequestById(@PathVariable Long id) {
        try {
            // This would require implementing findById in the JDBC repository
            // For now, return a placeholder response
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Single request retrieval not yet implemented in JDBC version");
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Health check endpoint for JDBC operations
     */
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check JDBC connection and query performance")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        try {
            long startTime = System.currentTimeMillis();
            long totalCount = purchaseRequestRepository.getTotalCount();
            long queryTime = System.currentTimeMillis() - startTime;

            Map<String, Object> health = new HashMap<>();
            health.put("status", "UP");
            health.put("totalRequests", totalCount);
            health.put("queryTimeMs", queryTime);
            health.put("jdbcOptimized", true);
            health.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(health);
        } catch (Exception e) {
            Map<String, Object> health = new HashMap<>();
            health.put("status", "DOWN");
            health.put("error", e.getMessage());
            health.put("jdbcOptimized", false);
            health.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(health);
        }
    }

    /**
     * Bulk operations endpoint
     */
    @PostMapping("/bulk-update-status")
    @Operation(summary = "Bulk update status", description = "Update multiple requests status efficiently")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> bulkUpdateStatus(
            @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Long> ids = (List<Long>) request.get("ids");
            String statusStr = (String) request.get("status");
            RequestStatus status = RequestStatus.valueOf(statusStr);

            int updatedCount = 0;
            for (Long id : ids) {
                purchaseRequestRepository.updateStatus(id, status);
                updatedCount++;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bulk update completed");
            response.put("updatedCount", updatedCount);
            response.put("newStatus", status);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Bulk update failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get current user ID from security context
     * This is a placeholder implementation
     */
    private Long getCurrentUserId() {
        // In a real implementation, this would extract user ID from Spring Security context
        // For now, return a default value
        return 1L;
    }
}
