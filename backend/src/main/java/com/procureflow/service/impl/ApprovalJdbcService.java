package com.procureflow.service.impl;

import com.procureflow.entity.Approval;
import com.procureflow.entity.ApprovalStatus;
import com.procureflow.repository.jdbc.ApprovalJdbcRepository;
import com.procureflow.service.ApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Approval Service Implementation using JDBC Template
 * High-performance service layer with optimized database operations
 */
@Service
@Transactional
public class ApprovalJdbcService implements ApprovalService {

    @Autowired
    private ApprovalJdbcRepository approvalRepository;

    @Override
    public Optional<Approval> findById(Long id) {
        return approvalRepository.findById(id);
    }

    @Override
    public List<Approval> findByPurchaseRequestId(Long purchaseRequestId) {
        return approvalRepository.findByPurchaseRequestId(purchaseRequestId);
    }

    @Override
    public List<Approval> findByApproverId(Long approverId, int page, int size) {
        return approvalRepository.findByApproverId(approverId, page, size);
    }

    @Override
    public List<Approval> findByStatus(ApprovalStatus status, int page, int size) {
        return approvalRepository.findByStatus(status, page, size);
    }

    @Override
    public List<Approval> findByApproverIdAndStatus(Long approverId, ApprovalStatus status, int page, int size) {
        return approvalRepository.findByApproverIdAndStatus(approverId, status, page, size);
    }

    @Override
    public List<Approval> findPendingApprovals(int limit) {
        return approvalRepository.findPendingApprovals(limit);
    }

    @Override
    public Approval createApproval(Approval approval) {
        // Set default status if not provided
        if (approval.getStatus() == null) {
            approval.setStatus(ApprovalStatus.PENDING);
        }

        Long id = approvalRepository.createApproval(approval);
        return approvalRepository.findById(id).orElse(approval);
    }

    @Override
    public Approval updateApproval(Approval approval) {
        approvalRepository.updateApproval(approval);
        return approvalRepository.findById(approval.getId()).orElse(approval);
    }

    @Override
    public void updateApprovalStatus(Long id, ApprovalStatus status, String comments) {
        approvalRepository.updateApprovalStatus(id, status, comments);
    }

    @Override
    public void deleteById(Long id) {
        approvalRepository.deleteById(id);
    }

    @Override
    public Long countByApproverIdAndStatus(Long approverId, ApprovalStatus status) {
        return approvalRepository.countByApproverIdAndStatus(approverId, status);
    }

    @Override
    public Long countApprovalsSince(LocalDateTime startDate, ApprovalStatus status) {
        return approvalRepository.countApprovalsSince(startDate, status);
    }

    @Override
    public Double getAverageApprovalTimeInHours() {
        return approvalRepository.getAverageApprovalTimeInHours();
    }

    @Override
    public Map<String, Object> getApprovalStatistics() {
        return approvalRepository.getApprovalStatistics();
    }

    @Override
    public List<Map<String, Object>> getApprovalCountByStatus() {
        return approvalRepository.getApprovalCountByStatus();
    }

    @Override
    public List<Map<String, Object>> getApprovalCountByLevel() {
        return approvalRepository.getApprovalCountByLevel();
    }

    @Override
    public long getTotalCountByApproverId(Long approverId) {
        return approvalRepository.getTotalCountByApproverId(approverId);
    }

    @Override
    public long getTotalCountByStatus(ApprovalStatus status) {
        return approvalRepository.getTotalCountByStatus(status);
    }

    @Override
    public long getTotalCountByApproverIdAndStatus(Long approverId, ApprovalStatus status) {
        return approvalRepository.getTotalCountByApproverIdAndStatus(approverId, status);
    }

    // Additional business logic methods

    @Transactional
    public Approval approveRequest(Long approvalId, String comments, Long approverId) {
        Optional<Approval> approvalOpt = approvalRepository.findById(approvalId);
        if (approvalOpt.isEmpty()) {
            throw new RuntimeException("Approval not found with id: " + approvalId);
        }

        Approval approval = approvalOpt.get();
        
        // Verify the approver
        if (!approval.getApprover().getId().equals(approverId)) {
            throw new RuntimeException("User is not authorized to approve this request");
        }

        if (approval.getStatus() != ApprovalStatus.PENDING) {
            throw new RuntimeException("Approval cannot be processed in current status: " + approval.getStatus());
        }

        approval.setStatus(ApprovalStatus.APPROVED);
        approval.setComments(comments);

        return updateApproval(approval);
    }

    @Transactional
    public Approval rejectRequest(Long approvalId, String comments, Long approverId) {
        Optional<Approval> approvalOpt = approvalRepository.findById(approvalId);
        if (approvalOpt.isEmpty()) {
            throw new RuntimeException("Approval not found with id: " + approvalId);
        }

        Approval approval = approvalOpt.get();
        
        // Verify the approver
        if (!approval.getApprover().getId().equals(approverId)) {
            throw new RuntimeException("User is not authorized to reject this request");
        }

        if (approval.getStatus() != ApprovalStatus.PENDING) {
            throw new RuntimeException("Approval cannot be processed in current status: " + approval.getStatus());
        }

        approval.setStatus(ApprovalStatus.REJECTED);
        approval.setComments(comments);

        return updateApproval(approval);
    }

    @Transactional
    public List<Approval> createApprovalChain(Long purchaseRequestId, List<Long> approverIds, int startingLevel) {
        List<Approval> approvals = new java.util.ArrayList<>();
        
        for (int i = 0; i < approverIds.size(); i++) {
            Approval approval = new Approval();
            // Set purchase request and approver based on your entity structure
            // approval.setPurchaseRequest(...);
            // approval.setApprover(...);
            approval.setLevel(startingLevel + i);
            approval.setStatus(i == 0 ? ApprovalStatus.PENDING : ApprovalStatus.PENDING); // First level starts pending
            
            Long id = approvalRepository.createApproval(approval);
            approvals.add(approvalRepository.findById(id).orElse(approval));
        }
        
        return approvals;
    }

    public List<Approval> getPendingApprovalsForUser(Long userId, int limit) {
        return approvalRepository.findByApproverIdAndStatus(userId, ApprovalStatus.PENDING, 0, limit);
    }

    public List<Approval> getApprovalHistory(Long purchaseRequestId) {
        return approvalRepository.findByPurchaseRequestId(purchaseRequestId);
    }

    public boolean isUserAuthorizedToApprove(Long approvalId, Long userId) {
        Optional<Approval> approvalOpt = approvalRepository.findById(approvalId);
        if (approvalOpt.isEmpty()) {
            return false;
        }

        Approval approval = approvalOpt.get();
        return approval.getApprover().getId().equals(userId) && 
               approval.getStatus() == ApprovalStatus.PENDING;
    }

    public boolean hasUserApprovedRequest(Long purchaseRequestId, Long userId) {
        List<Approval> approvals = approvalRepository.findByPurchaseRequestId(purchaseRequestId);
        return approvals.stream()
                .anyMatch(approval -> approval.getApprover().getId().equals(userId) && 
                         approval.getStatus() == ApprovalStatus.APPROVED);
    }

    public boolean isApprovalChainComplete(Long purchaseRequestId) {
        List<Approval> approvals = approvalRepository.findByPurchaseRequestId(purchaseRequestId);
        return approvals.stream()
                .allMatch(approval -> approval.getStatus() == ApprovalStatus.APPROVED);
    }

    public boolean isApprovalChainRejected(Long purchaseRequestId) {
        List<Approval> approvals = approvalRepository.findByPurchaseRequestId(purchaseRequestId);
        return approvals.stream()
                .anyMatch(approval -> approval.getStatus() == ApprovalStatus.REJECTED);
    }

    public Map<String, Object> getDashboardStatistics() {
        return approvalRepository.getApprovalStatistics();
    }

    public Approval getNextPendingApproval(Long purchaseRequestId) {
        List<Approval> approvals = approvalRepository.findByPurchaseRequestId(purchaseRequestId);
        return approvals.stream()
                .filter(approval -> approval.getStatus() == ApprovalStatus.PENDING)
                .min((a1, a2) -> Integer.compare(a1.getLevel(), a2.getLevel()))
                .orElse(null);
    }

    @Transactional
    public void cancelApprovalsForRequest(Long purchaseRequestId, String reason) {
        List<Approval> approvals = approvalRepository.findByPurchaseRequestId(purchaseRequestId);
        for (Approval approval : approvals) {
            if (approval.getStatus() == ApprovalStatus.PENDING) {
                approval.setStatus(ApprovalStatus.REJECTED);
                approval.setComments("Cancelled: " + reason);
                updateApproval(approval);
            }
        }
    }

    public List<Map<String, Object>> getApprovalPerformanceMetrics() {
        return approvalRepository.getApprovalCountByLevel();
    }

    public Double getAverageApprovalTimeForUser(Long userId) {
        // This would require additional query in repository
        // For now, return overall average
        return getAverageApprovalTimeInHours();
    }
}
