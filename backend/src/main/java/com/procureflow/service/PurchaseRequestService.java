package com.procureflow.service;

import com.procureflow.dto.request.PurchaseRequestDTO;
import com.procureflow.entity.Priority;
import com.procureflow.entity.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * Purchase Request Service Interface
 * Business logic for purchase request management
 */
public interface PurchaseRequestService {

    PurchaseRequestDTO create(PurchaseRequestDTO requestDTO);

    PurchaseRequestDTO update(PurchaseRequestDTO requestDTO);

    PurchaseRequestDTO findById(Long id);

    Page<PurchaseRequestDTO> findAll(Pageable pageable);

    Page<PurchaseRequestDTO> findByStatus(RequestStatus status, Pageable pageable);

    Page<PurchaseRequestDTO> findByCurrentUser(Pageable pageable);

    Page<PurchaseRequestDTO> findByMultipleCriteria(RequestStatus status, String department, 
                                                   Priority priority, Long requesterId, Pageable pageable);

    Page<PurchaseRequestDTO> searchRequests(String searchTerm, Pageable pageable);

    PurchaseRequestDTO updateStatus(Long id, RequestStatus status);

    PurchaseRequestDTO assignRequest(Long requestId, Long assigneeId);

    void deleteById(Long id);

    List<PurchaseRequestDTO> findPendingApprovals(int limit);

    Map<String, Object> getStatistics();

    List<String> getAllDepartments();
}
