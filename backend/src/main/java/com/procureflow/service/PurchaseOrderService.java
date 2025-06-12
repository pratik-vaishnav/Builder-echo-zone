package com.procureflow.service;

import com.procureflow.entity.OrderStatus;
import com.procureflow.entity.PurchaseOrder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Purchase Order Service Interface
 * Defines business operations for purchase orders
 */
public interface PurchaseOrderService {

    Optional<PurchaseOrder> findById(Long id);

    Optional<PurchaseOrder> findByOrderNumber(String orderNumber);

    Optional<PurchaseOrder> findByPurchaseRequestId(Long purchaseRequestId);

    List<PurchaseOrder> findByStatus(OrderStatus status, int page, int size);

    List<PurchaseOrder> findByCreatedById(Long createdById, int page, int size);

    List<PurchaseOrder> findPaginated(int page, int size, String sortBy, String sortDir, 
                                    OrderStatus status, String search);

    long getTotalCount(OrderStatus status, String search);

    List<PurchaseOrder> findOverdueOrders();

    List<PurchaseOrder> findByExpectedDeliveryDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    PurchaseOrder createPurchaseOrder(PurchaseOrder order);

    PurchaseOrder updatePurchaseOrder(PurchaseOrder order);

    void updateStatus(Long id, OrderStatus status);

    void deleteById(Long id);

    Map<String, Object> getOrderStatistics();

    List<Map<String, Object>> getOrderCountByStatus();

    String generateOrderNumber();
}
