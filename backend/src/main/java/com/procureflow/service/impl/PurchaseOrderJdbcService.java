package com.procureflow.service.impl;

import com.procureflow.entity.OrderStatus;
import com.procureflow.entity.PurchaseOrder;
import com.procureflow.repository.jdbc.PurchaseOrderJdbcRepository;
import com.procureflow.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Purchase Order Service Implementation using JDBC Template
 * High-performance service layer with optimized database operations
 */
@Service
@Transactional
public class PurchaseOrderJdbcService implements PurchaseOrderService {

    @Autowired
    private PurchaseOrderJdbcRepository purchaseOrderRepository;

    @Override
    public Optional<PurchaseOrder> findById(Long id) {
        return purchaseOrderRepository.findById(id);
    }

    @Override
    public Optional<PurchaseOrder> findByOrderNumber(String orderNumber) {
        return purchaseOrderRepository.findByOrderNumber(orderNumber);
    }

    @Override
    public Optional<PurchaseOrder> findByPurchaseRequestId(Long purchaseRequestId) {
        return purchaseOrderRepository.findByPurchaseRequestId(purchaseRequestId);
    }

    @Override
    public List<PurchaseOrder> findByStatus(OrderStatus status, int page, int size) {
        return purchaseOrderRepository.findByStatus(status, page, size);
    }

    @Override
    public List<PurchaseOrder> findByCreatedById(Long createdById, int page, int size) {
        return purchaseOrderRepository.findByCreatedById(createdById, page, size);
    }

    @Override
    public List<PurchaseOrder> findPaginated(int page, int size, String sortBy, String sortDir, 
                                           OrderStatus status, String search) {
        return purchaseOrderRepository.findPaginated(page, size, sortBy, sortDir, status, search);
    }

    @Override
    public long getTotalCount(OrderStatus status, String search) {
        return purchaseOrderRepository.getTotalCount(status, search);
    }

    @Override
    public List<PurchaseOrder> findOverdueOrders() {
        return purchaseOrderRepository.findOverdueOrders();
    }

    @Override
    public List<PurchaseOrder> findByExpectedDeliveryDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return purchaseOrderRepository.findByExpectedDeliveryDateBetween(startDate, endDate);
    }

    @Override
    public PurchaseOrder createPurchaseOrder(PurchaseOrder order) {
        // Generate order number if not provided
        if (order.getOrderNumber() == null || order.getOrderNumber().isEmpty()) {
            order.setOrderNumber(purchaseOrderRepository.generateOrderNumber());
        }

        // Set default status if not provided
        if (order.getStatus() == null) {
            order.setStatus(OrderStatus.DRAFT);
        }

        Long id = purchaseOrderRepository.createPurchaseOrder(order);
        return purchaseOrderRepository.findById(id).orElse(order);
    }

    @Override
    public PurchaseOrder updatePurchaseOrder(PurchaseOrder order) {
        purchaseOrderRepository.updatePurchaseOrder(order);
        return purchaseOrderRepository.findById(order.getId()).orElse(order);
    }

    @Override
    public void updateStatus(Long id, OrderStatus status) {
        purchaseOrderRepository.updateStatus(id, status);
    }

    @Override
    public void deleteById(Long id) {
        purchaseOrderRepository.deleteById(id);
    }

    @Override
    public Map<String, Object> getOrderStatistics() {
        return purchaseOrderRepository.getOrderStatistics();
    }

    @Override
    public List<Map<String, Object>> getOrderCountByStatus() {
        return purchaseOrderRepository.getOrderCountByStatus();
    }

    @Override
    public String generateOrderNumber() {
        return purchaseOrderRepository.generateOrderNumber();
    }

    // Additional business logic methods

    @Transactional
    public PurchaseOrder approvePurchaseOrder(Long id, String approverComments) {
        Optional<PurchaseOrder> orderOpt = purchaseOrderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Purchase Order not found with id: " + id);
        }

        PurchaseOrder order = orderOpt.get();
        if (order.getStatus() != OrderStatus.DRAFT) {
            throw new RuntimeException("Purchase Order cannot be approved in current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.SENT);
        if (approverComments != null && !approverComments.trim().isEmpty()) {
            order.setSpecialInstructions(
                (order.getSpecialInstructions() != null ? order.getSpecialInstructions() + "\n" : "") +
                "Approval Comments: " + approverComments
            );
        }

        return updatePurchaseOrder(order);
    }

    @Transactional
    public PurchaseOrder confirmPurchaseOrder(Long id, String supplierConfirmation) {
        Optional<PurchaseOrder> orderOpt = purchaseOrderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Purchase Order not found with id: " + id);
        }

        PurchaseOrder order = orderOpt.get();
        if (order.getStatus() != OrderStatus.SENT) {
            throw new RuntimeException("Purchase Order cannot be confirmed in current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CONFIRMED);
        if (supplierConfirmation != null && !supplierConfirmation.trim().isEmpty()) {
            order.setSpecialInstructions(
                (order.getSpecialInstructions() != null ? order.getSpecialInstructions() + "\n" : "") +
                "Supplier Confirmation: " + supplierConfirmation
            );
        }

        return updatePurchaseOrder(order);
    }

    @Transactional
    public PurchaseOrder markAsDelivered(Long id, String deliveryNotes) {
        Optional<PurchaseOrder> orderOpt = purchaseOrderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Purchase Order not found with id: " + id);
        }

        PurchaseOrder order = orderOpt.get();
        if (order.getStatus() != OrderStatus.IN_TRANSIT) {
            throw new RuntimeException("Purchase Order cannot be marked as delivered in current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.DELIVERED);
        if (deliveryNotes != null && !deliveryNotes.trim().isEmpty()) {
            order.setSpecialInstructions(
                (order.getSpecialInstructions() != null ? order.getSpecialInstructions() + "\n" : "") +
                "Delivery Notes: " + deliveryNotes
            );
        }

        return updatePurchaseOrder(order);
    }

    @Transactional
    public PurchaseOrder completePurchaseOrder(Long id, String completionNotes) {
        Optional<PurchaseOrder> orderOpt = purchaseOrderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Purchase Order not found with id: " + id);
        }

        PurchaseOrder order = orderOpt.get();
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Purchase Order cannot be completed in current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.COMPLETED);
        if (completionNotes != null && !completionNotes.trim().isEmpty()) {
            order.setSpecialInstructions(
                (order.getSpecialInstructions() != null ? order.getSpecialInstructions() + "\n" : "") +
                "Completion Notes: " + completionNotes
            );
        }

        return updatePurchaseOrder(order);
    }

    @Transactional
    public PurchaseOrder cancelPurchaseOrder(Long id, String cancellationReason) {
        Optional<PurchaseOrder> orderOpt = purchaseOrderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Purchase Order not found with id: " + id);
        }

        PurchaseOrder order = orderOpt.get();
        if (order.getStatus() == OrderStatus.COMPLETED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Purchase Order cannot be cancelled in current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        if (cancellationReason != null && !cancellationReason.trim().isEmpty()) {
            order.setSpecialInstructions(
                (order.getSpecialInstructions() != null ? order.getSpecialInstructions() + "\n" : "") +
                "Cancellation Reason: " + cancellationReason
            );
        }

        return updatePurchaseOrder(order);
    }

    public List<PurchaseOrder> findOrdersRequiringAttention() {
        // Orders that are overdue or have been in transit for too long
        return purchaseOrderRepository.findOverdueOrders();
    }

    public Map<String, Object> getDashboardStatistics() {
        return purchaseOrderRepository.getOrderStatistics();
    }

    public boolean canUserModifyOrder(Long orderId, Long userId) {
        Optional<PurchaseOrder> orderOpt = purchaseOrderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return false;
        }

        PurchaseOrder order = orderOpt.get();
        
        // Only creator can modify draft orders
        if (order.getStatus() == OrderStatus.DRAFT) {
            return order.getCreatedBy().getId().equals(userId);
        }

        // Once sent, orders can only be modified by authorized personnel
        // This would typically check user roles/permissions
        return false;
    }
}
