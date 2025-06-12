package com.procureflow.service.impl;

import com.procureflow.dto.request.PurchaseRequestDTO;
import com.procureflow.entity.Priority;
import com.procureflow.entity.RequestStatus;
import com.procureflow.repository.jdbc.PurchaseRequestJdbcRepository;
import com.procureflow.security.services.UserPrincipal;
import com.procureflow.service.PurchaseRequestService;
import com.procureflow.service.RealTimeNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Optimized JDBC-based Purchase Request Service
 * Uses raw SQL queries for maximum performance
 */
@Service
@Transactional
public class PurchaseRequestJdbcService implements PurchaseRequestService {

    @Autowired
    private PurchaseRequestJdbcRepository jdbcRepository;

    @Autowired
    private RealTimeNotificationService notificationService;

    @Override
    public PurchaseRequestDTO create(PurchaseRequestDTO requestDTO) {
        UserPrincipal userPrincipal = getCurrentUser();
        
        // Create the request
        Long requestId = jdbcRepository.createPurchaseRequest(requestDTO, userPrincipal.getId());
        
        // Retrieve the created request with full details
        PurchaseRequestDTO createdRequest = findById(requestId);
        
        // Send real-time notification
        notificationService.broadcastPurchaseRequestUpdate(createdRequest, "CREATED");
        
        return createdRequest;
    }

    @Override
    public PurchaseRequestDTO update(PurchaseRequestDTO requestDTO) {
        // Implementation would involve UPDATE query
        // For now, delegate to status update
        return updateStatus(requestDTO.getId(), requestDTO.getStatus());
    }

    @Override
    public PurchaseRequestDTO findById(Long id) {
        List<PurchaseRequestDTO> results = jdbcRepository.findByMultipleCriteria(
            null, null, null, null, 0, 1
        );
        
        return results.stream()
            .filter(r -> r.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Purchase request not found"));
    }

    @Override
    public Page<PurchaseRequestDTO> findAll(Pageable pageable) {
        List<PurchaseRequestDTO> requests = jdbcRepository.findPaginated(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            "created_at",
            "DESC"
        );
        
        long total = jdbcRepository.getTotalCount();
        
        return new PageImpl<>(requests, pageable, total);
    }

    @Override
    public Page<PurchaseRequestDTO> findByStatus(RequestStatus status, Pageable pageable) {
        List<PurchaseRequestDTO> requests = jdbcRepository.findByMultipleCriteria(
            status, null, null, null,
            pageable.getPageNumber(),
            pageable.getPageSize()
        );
        
        long total = jdbcRepository.getTotalCount(); // Could be optimized with count query
        
        return new PageImpl<>(requests, pageable, total);
    }

    @Override
    public Page<PurchaseRequestDTO> findByCurrentUser(Pageable pageable) {
        UserPrincipal userPrincipal = getCurrentUser();
        
        List<PurchaseRequestDTO> requests = jdbcRepository.findByMultipleCriteria(
            null, null, null, userPrincipal.getId(),
            pageable.getPageNumber(),
            pageable.getPageSize()
        );
        
        long total = jdbcRepository.getTotalCount(); // Could be optimized
        
        return new PageImpl<>(requests, pageable, total);
    }

    @Override
    public Page<PurchaseRequestDTO> findByMultipleCriteria(
            RequestStatus status, String department, Priority priority, 
            Long requesterId, Pageable pageable) {
        
        List<PurchaseRequestDTO> requests = jdbcRepository.findByMultipleCriteria(
            status, department, priority, requesterId,
            pageable.getPageNumber(),
            pageable.getPageSize()
        );
        
        long total = jdbcRepository.getTotalCount(); // Could be optimized
        
        return new PageImpl<>(requests, pageable, total);
    }

    @Override
    public Page<PurchaseRequestDTO> searchRequests(String searchTerm, Pageable pageable) {
        List<PurchaseRequestDTO> requests = jdbcRepository.searchRequests(
            searchTerm,
            pageable.getPageNumber(),
            pageable.getPageSize()
        );
        
        long total = jdbcRepository.getTotalCount(); // Could be optimized
        
        return new PageImpl<>(requests, pageable, total);
    }

    @Override
    public PurchaseRequestDTO updateStatus(Long id, RequestStatus status) {
        jdbcRepository.updateStatus(id, status);
        
        PurchaseRequestDTO updatedRequest = findById(id);
        
        // Send real-time notification
        notificationService.broadcastPurchaseRequestUpdate(updatedRequest, status.toString());
        notificationService.broadcastWorkflowUpdate(
            id,
            "Previous Status",
            status.toString(),
            "Status updated manually"
        );
        
        return updatedRequest;
    }

    @Override
    public PurchaseRequestDTO assignRequest(Long requestId, Long assigneeId) {
        // Would implement assignment logic here
        return findById(requestId);
    }

    @Override
    public void deleteById(Long id) {
        // Soft delete by updating status
        updateStatus(id, RequestStatus.CANCELLED);
    }

    @Override
    public List<PurchaseRequestDTO> findPendingApprovals(int limit) {
        return jdbcRepository.findPendingApprovals(limit);
    }

    @Override
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = jdbcRepository.getStatistics();
        
        // Add additional computed statistics
        stats.put("lastUpdated", LocalDateTime.now());
        
        // Get department breakdown
        List<Map<String, Object>> departmentBreakdown = jdbcRepository.getDepartmentBreakdown();
        Map<String, Object> departmentMap = new HashMap<>();
        for (Map<String, Object> row : departmentBreakdown) {
            departmentMap.put((String) row.get("department"), row.get("count"));
        }
        stats.put("departmentBreakdown", departmentMap);
        
        // Get recent activity
        List<Map<String, Object>> recentActivity = jdbcRepository.getRecentActivity(10);
        stats.put("recentActivity", recentActivity);
        
        return stats;
    }

    @Override
    public List<String> getAllDepartments() {
        return List.of("IT", "HR", "Finance", "Marketing", "Operations", "Admin");
    }

    private UserPrincipal getCurrentUser() {
        return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
