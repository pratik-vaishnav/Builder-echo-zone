package com.procureflow.repository;

import com.procureflow.entity.PurchaseOrder;
import com.procureflow.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Purchase Order Repository
 * Data access layer for PurchaseOrder entity
 */
@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    Optional<PurchaseOrder> findByOrderNumber(String orderNumber);

    List<PurchaseOrder> findByStatus(OrderStatus status);
    Page<PurchaseOrder> findByStatus(OrderStatus status, Pageable pageable);

    Optional<PurchaseOrder> findByPurchaseRequestId(Long purchaseRequestId);

    List<PurchaseOrder> findByCreatedById(Long createdById);
    Page<PurchaseOrder> findByCreatedById(Long createdById, Pageable pageable);

    @Query("SELECT po FROM PurchaseOrder po WHERE " +
           "LOWER(po.orderNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(po.supplierName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<PurchaseOrder> searchOrders(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(po) FROM PurchaseOrder po WHERE po.status = :status")
    Long countByStatus(@Param("status") OrderStatus status);

    @Query("SELECT COALESCE(SUM(po.totalAmount), 0) FROM PurchaseOrder po WHERE po.status = :status")
    BigDecimal sumTotalAmountByStatus(@Param("status") OrderStatus status);

    @Query("SELECT po FROM PurchaseOrder po WHERE po.expectedDeliveryDate BETWEEN :startDate AND :endDate")
    List<PurchaseOrder> findByExpectedDeliveryDateBetween(@Param("startDate") LocalDateTime startDate, 
                                                          @Param("endDate") LocalDateTime endDate);

    @Query("SELECT po FROM PurchaseOrder po WHERE po.expectedDeliveryDate < :currentDate AND po.status NOT IN ('DELIVERED', 'COMPLETED', 'CANCELLED')")
    List<PurchaseOrder> findOverdueOrders(@Param("currentDate") LocalDateTime currentDate);

    @Query("SELECT po.status, COUNT(po) FROM PurchaseOrder po GROUP BY po.status")
    List<Object[]> getOrderCountByStatus();
}
