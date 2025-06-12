package com.procureflow.service;

import com.procureflow.entity.*;
import com.procureflow.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Automated Workflow Service
 * Handles automated processing of PR to PO flow and real-time updates
 */
@Service
@EnableAsync
@Transactional
public class AutomatedWorkflowService {

    private static final Logger logger = LoggerFactory.getLogger(AutomatedWorkflowService.class);

    @Autowired
    private PurchaseRequestRepository purchaseRequestRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private ApprovalRepository approvalRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RealTimeNotificationService notificationService;

    @Autowired
    private PurchaseRequestService purchaseRequestService;

    /**
     * Auto-approve requests based on business rules
     * Runs every 30 seconds to check for eligible requests
     */
    @Scheduled(fixedRate = 30000)
    public void processAutoApprovals() {
        logger.info("🔄 Processing auto-approvals...");

        List<PurchaseRequest> pendingRequests = purchaseRequestRepository.findByStatus(RequestStatus.PENDING);

        for (PurchaseRequest request : pendingRequests) {
            processRequestApproval(request);
        }
    }

    /**
     * Auto-generate Purchase Orders for approved requests
     * Runs every 45 seconds
     */
    @Scheduled(fixedRate = 45000)
    public void processApprovedRequestsToPO() {
        logger.info("🔄 Processing approved requests to PO...");

        List<PurchaseRequest> approvedRequests = purchaseRequestRepository.findByStatus(RequestStatus.APPROVED);

        for (PurchaseRequest request : approvedRequests) {
            // Check if PO already exists
            if (purchaseOrderRepository.findByPurchaseRequestId(request.getId()).isEmpty()) {
                generatePurchaseOrder(request);
            }
        }
    }

    /**
     * Update statistics in real-time
     * Runs every 15 seconds
     */
    @Scheduled(fixedRate = 15000)
    public void updateRealTimeStatistics() {
        logger.debug("📊 Updating real-time statistics...");

        try {
            var statistics = purchaseRequestService.getStatistics();
            notificationService.broadcastStatisticsUpdate(statistics);
        } catch (Exception e) {
            logger.error("Error updating statistics", e);
        }
    }

    /**
     * Process individual request approval based on business rules
     */
    @Async
    public CompletableFuture<Void> processRequestApproval(PurchaseRequest request) {
        try {
            boolean shouldAutoApprove = evaluateAutoApprovalCriteria(request);

            if (shouldAutoApprove) {
                approveRequestAutomatically(request);
            } else {
                assignForManualReview(request);
            }
        } catch (Exception e) {
            logger.error("Error processing approval for request {}", request.getId(), e);
        }

        return CompletableFuture.completedFuture(null);
    }

    /**
     * Evaluate if request meets auto-approval criteria
     */
    private boolean evaluateAutoApprovalCriteria(PurchaseRequest request) {
        // Auto-approve if:
        // 1. Amount <= ₹50,000 for regular requests
        // 2. Amount <= ₹25,000 for urgent requests
        // 3. Department is IT and amount <= ₹100,000
        // 4. Request is for recurring items (contains "license", "subscription", etc.)

        BigDecimal amount = request.getTotalAmount();
        String department = request.getDepartment();
        Priority priority = request.getPriority();
        String title = request.getTitle().toLowerCase();

        // IT Department higher threshold
        if ("IT".equalsIgnoreCase(department) && amount.compareTo(new BigDecimal("100000")) <= 0) {
            return true;
        }

        // Recurring services auto-approval
        if (title.contains("license") || title.contains("subscription") || 
            title.contains("renewal") || title.contains("maintenance")) {
            return amount.compareTo(new BigDecimal("200000")) <= 0;
        }

        // Standard thresholds
        if (priority == Priority.URGENT && amount.compareTo(new BigDecimal("25000")) <= 0) {
            return true;
        }

        return amount.compareTo(new BigDecimal("50000")) <= 0;
    }

    /**
     * Automatically approve request
     */
    private void approveRequestAutomatically(PurchaseRequest request) {
        // Find system admin for auto-approval
        User systemApprover = userRepository.findByUsername("admin")
                .orElse(userRepository.findAll().stream()
                        .filter(u -> u.getRoles().stream()
                                .anyMatch(r -> r.getName() == ERole.ROLE_ADMIN))
                        .findFirst()
                        .orElse(null));

        if (systemApprover == null) {
            logger.warn("No admin user found for auto-approval");
            return;
        }

        // Create approval record
        Approval approval = new Approval();
        approval.setPurchaseRequest(request);
        approval.setApprover(systemApprover);
        approval.setStatus(ApprovalStatus.APPROVED);
        approval.setComments(generateAutoApprovalComment(request));
        approval.setApprovalLevel(1);

        approvalRepository.save(approval);

        // Update request status
        request.setStatus(RequestStatus.APPROVED);
        purchaseRequestRepository.save(request);

        // Send real-time notification
        notificationService.broadcastApprovalUpdate(
                request.getId(),
                "APPROVED",
                "System (Auto-Approval)",
                approval.getComments()
        );

        notificationService.broadcastWorkflowUpdate(
                request.getId(),
                "PENDING",
                "APPROVED",
                "Auto-approved based on business rules"
        );

        logger.info("✅ Auto-approved request {} for ₹{}", request.getId(), request.getTotalAmount());
    }

    /**
     * Assign request for manual review
     */
    private void assignForManualReview(PurchaseRequest request) {
        // Update status to under review
        request.setStatus(RequestStatus.UNDER_REVIEW);

        // Assign to appropriate manager based on department
        User manager = findDepartmentManager(request.getDepartment());
        if (manager != null) {
            request.setAssignedTo(manager);
        }

        purchaseRequestRepository.save(request);

        // Send notification
        notificationService.broadcastWorkflowUpdate(
                request.getId(),
                "PENDING",
                "UNDER_REVIEW",
                "Assigned for manual review - amount exceeds auto-approval threshold"
        );

        logger.info("🔍 Assigned request {} for manual review (₹{})", request.getId(), request.getTotalAmount());
    }

    /**
     * Generate Purchase Order for approved request
     */
    @Async
    public CompletableFuture<Void> generatePurchaseOrder(PurchaseRequest request) {
        try {
            // Simulate processing time
            Thread.sleep(2000);

            User creator = userRepository.findByUsername("admin")
                    .orElse(request.getRequestedBy());

            PurchaseOrder order = new PurchaseOrder();
            order.setPurchaseRequest(request);
            order.setCreatedBy(creator);
            order.setTotalAmount(request.getTotalAmount());
            order.setStatus(OrderStatus.PENDING);
            order.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
            order.setDeliveryAddress(getDefaultDeliveryAddress(request.getDepartment()));

            // Auto-assign supplier based on items
            String supplier = determinePreferredSupplier(request);
            order.setSupplierName(supplier);
            order.setSupplierEmail(generateSupplierEmail(supplier));
            order.setSupplierContact(generateSupplierContact(supplier));

            order.setNotes("Auto-generated PO from approved request #" + request.getRequestNumber());

            PurchaseOrder savedOrder = purchaseOrderRepository.save(order);

            // Update request status
            request.setStatus(RequestStatus.IN_PROGRESS);
            purchaseRequestRepository.save(request);

            // Send real-time notifications
            notificationService.broadcastPurchaseOrderCreated(
                    request.getId(),
                    savedOrder.getOrderNumber(),
                    savedOrder.getSupplierName()
            );

            notificationService.broadcastWorkflowUpdate(
                    request.getId(),
                    "APPROVED",
                    "IN_PROGRESS",
                    "Purchase Order " + savedOrder.getOrderNumber() + " generated"
            );

            logger.info("📦 Generated PO {} for request {} (₹{})", 
                       savedOrder.getOrderNumber(), request.getId(), request.getTotalAmount());

            // Simulate order confirmation after some time
            scheduleOrderConfirmation(savedOrder);

        } catch (Exception e) {
            logger.error("Error generating PO for request {}", request.getId(), e);
        }

        return CompletableFuture.completedFuture(null);
    }

    /**
     * Schedule order confirmation (simulating supplier response)
     */
    @Async
    public void scheduleOrderConfirmation(PurchaseOrder order) {
        try {
            // Wait 30-60 seconds before confirming
            Thread.sleep(30000 + (long)(Math.random() * 30000));

            order.setStatus(OrderStatus.CONFIRMED);
            purchaseOrderRepository.save(order);

            notificationService.broadcastWorkflowUpdate(
                    order.getPurchaseRequest().getId(),
                    "IN_PROGRESS",
                    "CONFIRMED",
                    "Supplier confirmed order " + order.getOrderNumber()
            );

            logger.info("✅ Order {} confirmed by supplier", order.getOrderNumber());

        } catch (Exception e) {
            logger.error("Error confirming order {}", order.getOrderNumber(), e);
        }
    }

    // Helper methods
    private String generateAutoApprovalComment(PurchaseRequest request) {
        BigDecimal amount = request.getTotalAmount();
        return String.format("Auto-approved: Amount ₹%,.2f is within auto-approval threshold. " +
                           "Request meets business criteria for %s department.", 
                           amount, request.getDepartment());
    }

    private User findDepartmentManager(String department) {
        return userRepository.findByRoleNameAndIsActiveTrue("ROLE_MANAGER")
                .stream()
                .filter(u -> department.equals(u.getDepartment()))
                .findFirst()
                .orElse(userRepository.findByRoleNameAndIsActiveTrue("ROLE_MANAGER")
                        .stream().findFirst().orElse(null));
    }

    private String determinePreferredSupplier(PurchaseRequest request) {
        // Logic to determine supplier based on items
        String title = request.getTitle().toLowerCase();
        if (title.contains("laptop") || title.contains("computer")) return "Dell Technologies";
        if (title.contains("software") || title.contains("license")) return "Microsoft India";
        if (title.contains("furniture") || title.contains("chair")) return "Godrej Interio";
        if (title.contains("stationery") || title.contains("office")) return "ITC Limited";
        return "TCS Supplier Network";
    }

    private String generateSupplierEmail(String supplier) {
        return "orders@" + supplier.toLowerCase().replace(" ", "").replace(".", "") + ".com";
    }

    private String generateSupplierContact(String supplier) {
        return "+91-" + (1000000000L + (long)(Math.random() * 9000000000L));
    }

    private String getDefaultDeliveryAddress(String department) {
        return String.format("ProcureFlow Technologies Pvt Ltd\n%s Department\nPlot No. 123, Sector 18\nGurgaon, Haryana 122015\nIndia", department);
    }
}
