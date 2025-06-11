package com.procureflow.repository;

import com.procureflow.entity.PurchaseRequest;
import com.procureflow.entity.RequestStatus;
import com.procureflow.entity.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Purchase Request Repository
 * Data access layer for PurchaseRequest entity
 */
@Repository
public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest, Long> {

    // Find by status
    List<PurchaseRequest> findByStatus(RequestStatus status);
    Page<PurchaseRequest> findByStatus(RequestStatus status, Pageable pageable);

    // Find by requester
    List<PurchaseRequest> findByRequestedById(Long userId);
    Page<PurchaseRequest> findByRequestedById(Long userId, Pageable pageable);

    // Find by department
    List<PurchaseRequest> findByDepartment(String department);
    Page<PurchaseRequest> findByDepartment(String department, Pageable pageable);

    // Find by priority
    List<PurchaseRequest> findByPriority(Priority priority);
    Page<PurchaseRequest> findByPriority(Priority priority, Pageable pageable);

    // Find by multiple criteria
    @Query("SELECT pr FROM PurchaseRequest pr WHERE " +
           "(:status IS NULL OR pr.status = :status) AND " +
           "(:department IS NULL OR pr.department = :department) AND " +
           "(:priority IS NULL OR pr.priority = :priority) AND " +
           "(:requesterId IS NULL OR pr.requestedBy.id = :requesterId)")
    Page<PurchaseRequest> findByMultipleCriteria(
            @Param("status") RequestStatus status,
            @Param("department") String department,
            @Param("priority") Priority priority,
            @Param("requesterId") Long requesterId,
            Pageable pageable);

    // Search functionality
    @Query("SELECT pr FROM PurchaseRequest pr WHERE " +
           "LOWER(pr.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(pr.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(pr.department) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<PurchaseRequest> searchRequests(@Param("search") String search, Pageable pageable);

    // Statistics queries
    @Query("SELECT COUNT(pr) FROM PurchaseRequest pr WHERE pr.status = :status")
    Long countByStatus(@Param("status") RequestStatus status);

    @Query("SELECT COALESCE(SUM(pr.totalAmount), 0) FROM PurchaseRequest pr WHERE pr.status = :status")
    BigDecimal sumTotalAmountByStatus(@Param("status") RequestStatus status);

    @Query("SELECT COUNT(pr) FROM PurchaseRequest pr WHERE pr.createdAt >= :startDate")
    Long countRequestsSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT pr.department, COUNT(pr) FROM PurchaseRequest pr GROUP BY pr.department")
    List<Object[]> getRequestCountByDepartment();

    @Query("SELECT pr.status, COUNT(pr) FROM PurchaseRequest pr GROUP BY pr.status")
    List<Object[]> getRequestCountByStatus();

    // Recent requests
    @Query("SELECT pr FROM PurchaseRequest pr ORDER BY pr.createdAt DESC")
    List<PurchaseRequest> findRecentRequests(Pageable pageable);

    // Pending approvals
    @Query("SELECT pr FROM PurchaseRequest pr WHERE pr.status IN ('PENDING', 'UNDER_REVIEW') ORDER BY pr.priority DESC, pr.createdAt ASC")
    List<PurchaseRequest> findPendingApprovals(Pageable pageable);

    // Requests assigned to user
    @Query("SELECT pr FROM PurchaseRequest pr WHERE pr.assignedTo.id = :userId")
    Page<PurchaseRequest> findByAssignedToId(@Param("userId") Long userId, Pageable pageable);
}
