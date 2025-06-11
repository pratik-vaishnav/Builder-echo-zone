package com.procureflow.service.impl;

import com.procureflow.dto.request.PurchaseRequestDTO;
import com.procureflow.dto.request.RequestItemDTO;
import com.procureflow.entity.*;
import com.procureflow.repository.PurchaseRequestRepository;
import com.procureflow.repository.UserRepository;
import com.procureflow.security.services.UserPrincipal;
import com.procureflow.service.PurchaseRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Purchase Request Service Implementation
 * Business logic implementation for purchase request management
 */
@Service
@Transactional
public class PurchaseRequestServiceImpl implements PurchaseRequestService {

    @Autowired
    private PurchaseRequestRepository purchaseRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public PurchaseRequestDTO create(PurchaseRequestDTO requestDTO) {
        PurchaseRequest request = convertToEntity(requestDTO);
        
        // Set the current user as the requester
        UserPrincipal userPrincipal = getCurrentUser();
        User currentUser = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        request.setRequestedBy(currentUser);
        request.setStatus(RequestStatus.PENDING);
        
        // Calculate total amount from items
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            BigDecimal totalAmount = request.getItems().stream()
                    .map(RequestItem::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            request.setTotalAmount(totalAmount);
        }

        PurchaseRequest savedRequest = purchaseRequestRepository.save(request);
        return convertToDTO(savedRequest);
    }

    @Override
    public PurchaseRequestDTO update(PurchaseRequestDTO requestDTO) {
        PurchaseRequest existingRequest = purchaseRequestRepository.findById(requestDTO.getId())
                .orElseThrow(() -> new RuntimeException("Purchase request not found"));

        // Update fields
        existingRequest.setTitle(requestDTO.getTitle());
        existingRequest.setDescription(requestDTO.getDescription());
        existingRequest.setDepartment(requestDTO.getDepartment());
        existingRequest.setPriority(requestDTO.getPriority());
        existingRequest.setJustification(requestDTO.getJustification());
        existingRequest.setExpectedDeliveryDate(requestDTO.getExpectedDeliveryDate());

        // Update items if provided
        if (requestDTO.getItems() != null) {
            // Clear existing items
            existingRequest.getItems().clear();
            
            // Add new items
            for (RequestItemDTO itemDTO : requestDTO.getItems()) {
                RequestItem item = convertItemToEntity(itemDTO);
                existingRequest.addItem(item);
            }

            // Recalculate total amount
            BigDecimal totalAmount = existingRequest.getItems().stream()
                    .map(RequestItem::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            existingRequest.setTotalAmount(totalAmount);
        }

        PurchaseRequest savedRequest = purchaseRequestRepository.save(existingRequest);
        return convertToDTO(savedRequest);
    }

    @Override
    public PurchaseRequestDTO findById(Long id) {
        PurchaseRequest request = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase request not found"));
        return convertToDTO(request);
    }

    @Override
    public Page<PurchaseRequestDTO> findAll(Pageable pageable) {
        Page<PurchaseRequest> requests = purchaseRequestRepository.findAll(pageable);
        return requests.map(this::convertToDTO);
    }

    @Override
    public Page<PurchaseRequestDTO> findByStatus(RequestStatus status, Pageable pageable) {
        Page<PurchaseRequest> requests = purchaseRequestRepository.findByStatus(status, pageable);
        return requests.map(this::convertToDTO);
    }

    @Override
    public Page<PurchaseRequestDTO> findByCurrentUser(Pageable pageable) {
        UserPrincipal userPrincipal = getCurrentUser();
        Page<PurchaseRequest> requests = purchaseRequestRepository.findByRequestedById(userPrincipal.getId(), pageable);
        return requests.map(this::convertToDTO);
    }

    @Override
    public Page<PurchaseRequestDTO> findByMultipleCriteria(RequestStatus status, String department, 
                                                          Priority priority, Long requesterId, Pageable pageable) {
        Page<PurchaseRequest> requests = purchaseRequestRepository.findByMultipleCriteria(
                status, department, priority, requesterId, pageable);
        return requests.map(this::convertToDTO);
    }

    @Override
    public Page<PurchaseRequestDTO> searchRequests(String searchTerm, Pageable pageable) {
        Page<PurchaseRequest> requests = purchaseRequestRepository.searchRequests(searchTerm, pageable);
        return requests.map(this::convertToDTO);
    }

    @Override
    public PurchaseRequestDTO updateStatus(Long id, RequestStatus status) {
        PurchaseRequest request = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase request not found"));
        
        request.setStatus(status);
        PurchaseRequest savedRequest = purchaseRequestRepository.save(request);
        return convertToDTO(savedRequest);
    }

    @Override
    public PurchaseRequestDTO assignRequest(Long requestId, Long assigneeId) {
        PurchaseRequest request = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Purchase request not found"));
        
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new RuntimeException("Assignee not found"));
        
        request.setAssignedTo(assignee);
        PurchaseRequest savedRequest = purchaseRequestRepository.save(request);
        return convertToDTO(savedRequest);
    }

    @Override
    public void deleteById(Long id) {
        PurchaseRequest request = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase request not found"));
        
        // Soft delete by setting status to CANCELLED
        request.setStatus(RequestStatus.CANCELLED);
        purchaseRequestRepository.save(request);
    }

    @Override
    public List<PurchaseRequestDTO> findPendingApprovals(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<PurchaseRequest> requests = purchaseRequestRepository.findPendingApprovals(pageable);
        return requests.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total counts by status
        stats.put("totalRequests", purchaseRequestRepository.count());
        stats.put("pendingRequests", purchaseRequestRepository.countByStatus(RequestStatus.PENDING));
        stats.put("approvedRequests", purchaseRequestRepository.countByStatus(RequestStatus.APPROVED));
        stats.put("rejectedRequests", purchaseRequestRepository.countByStatus(RequestStatus.REJECTED));
        
        // Total amounts by status
        stats.put("totalSpent", purchaseRequestRepository.sumTotalAmountByStatus(RequestStatus.COMPLETED));
        stats.put("pendingAmount", purchaseRequestRepository.sumTotalAmountByStatus(RequestStatus.PENDING));
        
        // Recent activity
        LocalDateTime lastWeek = LocalDateTime.now().minusDays(7);
        stats.put("requestsThisWeek", purchaseRequestRepository.countRequestsSince(lastWeek));
        
        // Department breakdown
        List<Object[]> departmentStats = purchaseRequestRepository.getRequestCountByDepartment();
        Map<String, Long> departmentMap = new HashMap<>();
        for (Object[] row : departmentStats) {
            departmentMap.put((String) row[0], (Long) row[1]);
        }
        stats.put("departmentBreakdown", departmentMap);
        
        // Status breakdown
        List<Object[]> statusStats = purchaseRequestRepository.getRequestCountByStatus();
        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] row : statusStats) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }
        stats.put("statusBreakdown", statusMap);
        
        return stats;
    }

    @Override
    public List<String> getAllDepartments() {
        return userRepository.findAllDepartments();
    }

    // Helper methods
    private UserPrincipal getCurrentUser() {
        return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private PurchaseRequest convertToEntity(PurchaseRequestDTO dto) {
        PurchaseRequest request = new PurchaseRequest();
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setDepartment(dto.getDepartment());
        request.setPriority(dto.getPriority());
        request.setJustification(dto.getJustification());
        request.setExpectedDeliveryDate(dto.getExpectedDeliveryDate());
        request.setTotalAmount(dto.getTotalAmount() != null ? dto.getTotalAmount() : BigDecimal.ZERO);

        // Convert items
        if (dto.getItems() != null) {
            for (RequestItemDTO itemDTO : dto.getItems()) {
                RequestItem item = convertItemToEntity(itemDTO);
                request.addItem(item);
            }
        }

        return request;
    }

    private RequestItem convertItemToEntity(RequestItemDTO dto) {
        RequestItem item = new RequestItem();
        item.setItemName(dto.getItemName());
        item.setDescription(dto.getDescription());
        item.setQuantity(dto.getQuantity());
        item.setUnitPrice(dto.getUnitPrice());
        item.setSpecifications(dto.getSpecifications());
        item.setPreferredSupplier(dto.getPreferredSupplier());
        return item;
    }

    private PurchaseRequestDTO convertToDTO(PurchaseRequest request) {
        PurchaseRequestDTO dto = new PurchaseRequestDTO();
        dto.setId(request.getId());
        dto.setTitle(request.getTitle());
        dto.setDescription(request.getDescription());
        dto.setDepartment(request.getDepartment());
        dto.setPriority(request.getPriority());
        dto.setStatus(request.getStatus());
        dto.setTotalAmount(request.getTotalAmount());
        dto.setJustification(request.getJustification());
        dto.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
        dto.setRequestNumber(request.getRequestNumber());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());

        // Set requester information
        if (request.getRequestedBy() != null) {
            dto.setRequestedById(request.getRequestedBy().getId());
            dto.setRequestedByName(request.getRequestedBy().getFullName());
            dto.setRequestedByEmail(request.getRequestedBy().getEmail());
        }

        // Set assignee information
        if (request.getAssignedTo() != null) {
            dto.setAssignedToId(request.getAssignedTo().getId());
            dto.setAssignedToName(request.getAssignedTo().getFullName());
        }

        // Convert items
        if (request.getItems() != null) {
            List<RequestItemDTO> itemDTOs = request.getItems().stream()
                    .map(this::convertItemToDTO)
                    .collect(Collectors.toList());
            dto.setItems(itemDTOs);
        }

        return dto;
    }

    private RequestItemDTO convertItemToDTO(RequestItem item) {
        RequestItemDTO dto = new RequestItemDTO();
        dto.setId(item.getId());
        dto.setItemName(item.getItemName());
        dto.setDescription(item.getDescription());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());
        dto.setSpecifications(item.getSpecifications());
        dto.setPreferredSupplier(item.getPreferredSupplier());
        return dto;
    }
}
