package com.procureflow.service;

import com.procureflow.entity.Approval;
import com.procureflow.entity.ApprovalStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Approval Service Interface
 * Defines business operations for approvals
 */
public interface ApprovalService {

    Optional<Approval> findById(Long id);

    List<Approval> findByPurchaseRequestId(Long purchaseRequestId);

    List<Approval> findByApproverId(Long approverId, int page, int size);

    List<Approval> findByStatus(ApprovalStatus status, int page, int size);

    List<Approval> findByApproverIdAndStatus(Long approverId, ApprovalStatus status, int page, int size);

    List<Approval> findPendingApprovals(int limit);

    Approval createApproval(Approval approval);

    Approval updateApproval(Approval approval);

    void updateApprovalStatus(Long id, ApprovalStatus status, String comments);

    void deleteById(Long id);

    Long countByApproverIdAndStatus(Long approverId, ApprovalStatus status);

    Long countApprovalsSince(LocalDateTime startDate, ApprovalStatus status);

    Double getAverageApprovalTimeInHours();

    Map<String, Object> getApprovalStatistics();

    List<Map<String, Object>> getApprovalCountByStatus();

    List<Map<String, Object>> getApprovalCountByLevel();

    long getTotalCountByApproverId(Long approverId);

    long getTotalCountByStatus(ApprovalStatus status);

    long getTotalCountByApproverIdAndStatus(Long approverId, ApprovalStatus status);
}
