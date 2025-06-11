package com.procureflow.controller;

import com.procureflow.dto.request.PurchaseRequestDTO;
import com.procureflow.entity.Priority;
import com.procureflow.entity.RequestStatus;
import com.procureflow.service.PurchaseRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Purchase Request Controller
 * REST API endpoints for managing purchase requests
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/purchase-requests")
@Tag(name = "Purchase Requests", description = "Purchase request management APIs")
public class PurchaseRequestController {

    @Autowired
    private PurchaseRequestService purchaseRequestService;

    @GetMapping
    @Operation(summary = "Get all purchase requests", description = "Retrieve paginated list of purchase requests with optional filtering")
    public ResponseEntity<Page<PurchaseRequestDTO>> getAllRequests(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir,
            @Parameter(description = "Filter by status") @RequestParam(required = false) RequestStatus status,
            @Parameter(description = "Filter by department") @RequestParam(required = false) String department,
            @Parameter(description = "Filter by priority") @RequestParam(required = false) Priority priority,
            @Parameter(description = "Search term") @RequestParam(required = false) String search) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<PurchaseRequestDTO> requests;
        
        if (search != null && !search.trim().isEmpty()) {
            requests = purchaseRequestService.searchRequests(search, pageable);
        } else {
            requests = purchaseRequestService.findByMultipleCriteria(status, department, priority, null, pageable);
        }

        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get purchase request by ID", description = "Retrieve a specific purchase request by its ID")
    public ResponseEntity<PurchaseRequestDTO> getRequestById(@PathVariable Long id) {
        PurchaseRequestDTO request = purchaseRequestService.findById(id);
        return ResponseEntity.ok(request);
    }

    @PostMapping
    @Operation(summary = "Create purchase request", description = "Create a new purchase request")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<PurchaseRequestDTO> createRequest(@Valid @RequestBody PurchaseRequestDTO requestDTO) {
        PurchaseRequestDTO createdRequest = purchaseRequestService.create(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update purchase request", description = "Update an existing purchase request")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<PurchaseRequestDTO> updateRequest(@PathVariable Long id, 
                                                           @Valid @RequestBody PurchaseRequestDTO requestDTO) {
        requestDTO.setId(id);
        PurchaseRequestDTO updatedRequest = purchaseRequestService.update(requestDTO);
        return ResponseEntity.ok(updatedRequest);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update request status", description = "Update the status of a purchase request")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<PurchaseRequestDTO> updateRequestStatus(@PathVariable Long id, 
                                                                 @RequestParam RequestStatus status) {
        PurchaseRequestDTO updatedRequest = purchaseRequestService.updateStatus(id, status);
        return ResponseEntity.ok(updatedRequest);
    }

    @PutMapping("/{id}/assign")
    @Operation(summary = "Assign request", description = "Assign a purchase request to a user")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<PurchaseRequestDTO> assignRequest(@PathVariable Long id, 
                                                           @RequestParam Long assigneeId) {
        PurchaseRequestDTO updatedRequest = purchaseRequestService.assignRequest(id, assigneeId);
        return ResponseEntity.ok(updatedRequest);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete purchase request", description = "Delete a purchase request (soft delete)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        purchaseRequestService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-requests")
    @Operation(summary = "Get current user's requests", description = "Retrieve purchase requests created by the current user")
    public ResponseEntity<Page<PurchaseRequestDTO>> getMyRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<PurchaseRequestDTO> requests = purchaseRequestService.findByCurrentUser(pageable);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/pending-approval")
    @Operation(summary = "Get pending approvals", description = "Retrieve requests pending approval")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<PurchaseRequestDTO>> getPendingApprovals(
            @RequestParam(defaultValue = "20") int limit) {

        List<PurchaseRequestDTO> requests = purchaseRequestService.findPendingApprovals(limit);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get request statistics", description = "Retrieve statistical data about purchase requests")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> statistics = purchaseRequestService.getStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/departments")
    @Operation(summary = "Get all departments", description = "Retrieve list of all departments")
    public ResponseEntity<List<String>> getAllDepartments() {
        List<String> departments = purchaseRequestService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }
}
