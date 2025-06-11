package com.procureflow.repository;

import com.procureflow.entity.Approval;
import com.procureflow.entity.ApprovalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Approval Repository
 * Data access layer for Approval entity
 */
@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {

    List<Approval> findByPurchaseRequestId(Long purchaseRequestId);

    List<Approval> findByApproverId(Long approverId);
    Page<Approval> findByApproverId(Long approverId, Pageable pageable);

    List<Approval> findByStatus(ApprovalStatus status);
    Page<Approval> findByStatus(ApprovalStatus status, Pageable pageable);

    @Query("SELECT a FROM Approval a WHERE a.approver.id = :approverId AND a.status = :status")
    Page<Approval> findByApproverIdAndStatus(@Param("approverId") Long approverId, 
                                           @Param("status") ApprovalStatus status, 
                                           Pageable pageable);

    @Query("SELECT COUNT(a) FROM Approval a WHERE a.approver.id = :approverId AND a.status = :status")
    Long countByApproverIdAndStatus(@Param("approverId") Long approverId, 
                                   @Param("status") ApprovalStatus status);

    @Query("SELECT a FROM Approval a WHERE a.status = 'PENDING' ORDER BY a.createdAt ASC")
    List<Approval> findPendingApprovals(Pageable pageable);

    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, a.createdAt, a.updatedAt)) FROM Approval a WHERE a.status != 'PENDING'")
    Double getAverageApprovalTimeInHours();

    @Query("SELECT COUNT(a) FROM Approval a WHERE a.createdAt >= :startDate AND a.status = :status")
    Long countApprovalsSince(@Param("startDate") LocalDateTime startDate, 
                            @Param("status") ApprovalStatus status);
}
