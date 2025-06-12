package com.procureflow.service;

import com.procureflow.dto.realtime.NotificationDTO;
import com.procureflow.dto.realtime.StatisticsUpdateDTO;
import com.procureflow.dto.request.PurchaseRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Real-time Notification Service
 * Handles broadcasting real-time updates to connected clients
 */
@Service
public class RealTimeNotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast purchase request update to all users
     */
    public void broadcastPurchaseRequestUpdate(PurchaseRequestDTO request, String action) {
        NotificationDTO notification = new NotificationDTO();
        notification.setType("PURCHASE_REQUEST_UPDATE");
        notification.setTitle(getNotificationTitle(action, request));
        notification.setMessage(getNotificationMessage(action, request));
        notification.setData(request);
        notification.setTimestamp(LocalDateTime.now());
        notification.setAction(action);

        // Broadcast to all subscribers of purchase request updates
        messagingTemplate.convertAndSend("/topic/purchase-requests", notification);
        
        // Send to dashboard for real-time statistics update
        messagingTemplate.convertAndSend("/topic/dashboard/updates", notification);
    }

    /**
     * Broadcast approval update
     */
    public void broadcastApprovalUpdate(Long requestId, String status, String approverName, String comments) {
        NotificationDTO notification = new NotificationDTO();
        notification.setType("APPROVAL_UPDATE");
        notification.setTitle("Request " + status);
        notification.setMessage(String.format("Request #%d has been %s by %s", requestId, status.toLowerCase(), approverName));
        notification.setTimestamp(LocalDateTime.now());
        notification.setAction(status);
        
        Map<String, Object> data = Map.of(
            "requestId", requestId,
            "status", status,
            "approverName", approverName,
            "comments", comments
        );
        notification.setData(data);

        messagingTemplate.convertAndSend("/topic/approvals", notification);
        messagingTemplate.convertAndSend("/topic/dashboard/updates", notification);
    }

    /**
     * Broadcast purchase order creation
     */
    public void broadcastPurchaseOrderCreated(Long requestId, String orderNumber, String supplierName) {
        NotificationDTO notification = new NotificationDTO();
        notification.setType("PURCHASE_ORDER_CREATED");
        notification.setTitle("Purchase Order Created");
        notification.setMessage(String.format("PO %s created for Request #%d with supplier %s", 
                                            orderNumber, requestId, supplierName));
        notification.setTimestamp(LocalDateTime.now());
        notification.setAction("CREATED");
        
        Map<String, Object> data = Map.of(
            "requestId", requestId,
            "orderNumber", orderNumber,
            "supplierName", supplierName
        );
        notification.setData(data);

        messagingTemplate.convertAndSend("/topic/purchase-orders", notification);
        messagingTemplate.convertAndSend("/topic/dashboard/updates", notification);
    }

    /**
     * Broadcast real-time statistics update
     */
    public void broadcastStatisticsUpdate(Map<String, Object> statistics) {
        StatisticsUpdateDTO update = new StatisticsUpdateDTO();
        update.setStatistics(statistics);
        update.setTimestamp(LocalDateTime.now());
        update.setType("STATISTICS_UPDATE");

        messagingTemplate.convertAndSend("/topic/dashboard/statistics", update);
    }

    /**
     * Send personal notification to specific user
     */
    public void sendPersonalNotification(String username, NotificationDTO notification) {
        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", notification);
    }

    /**
     * Broadcast workflow status change
     */
    public void broadcastWorkflowUpdate(Long requestId, String fromStatus, String toStatus, String reason) {
        NotificationDTO notification = new NotificationDTO();
        notification.setType("WORKFLOW_UPDATE");
        notification.setTitle("Workflow Progress");
        notification.setMessage(String.format("Request #%d moved from %s to %s", requestId, fromStatus, toStatus));
        notification.setTimestamp(LocalDateTime.now());
        notification.setAction("STATUS_CHANGE");
        
        Map<String, Object> data = Map.of(
            "requestId", requestId,
            "fromStatus", fromStatus,
            "toStatus", toStatus,
            "reason", reason
        );
        notification.setData(data);

        messagingTemplate.convertAndSend("/topic/workflow", notification);
        messagingTemplate.convertAndSend("/topic/dashboard/updates", notification);
    }

    private String getNotificationTitle(String action, PurchaseRequestDTO request) {
        return switch (action.toUpperCase()) {
            case "CREATED" -> "New Purchase Request";
            case "UPDATED" -> "Request Updated";
            case "APPROVED" -> "Request Approved";
            case "REJECTED" -> "Request Rejected";
            case "COMPLETED" -> "Request Completed";
            default -> "Request " + action;
        };
    }

    private String getNotificationMessage(String action, PurchaseRequestDTO request) {
        return switch (action.toUpperCase()) {
            case "CREATED" -> String.format("New request '%s' created by %s (₹%,.2f)", 
                                          request.getTitle(), request.getRequestedByName(), request.getTotalAmount());
            case "UPDATED" -> String.format("Request '%s' has been updated", request.getTitle());
            case "APPROVED" -> String.format("Request '%s' approved for ₹%,.2f", 
                                           request.getTitle(), request.getTotalAmount());
            case "REJECTED" -> String.format("Request '%s' has been rejected", request.getTitle());
            case "COMPLETED" -> String.format("Request '%s' completed successfully", request.getTitle());
            default -> String.format("Request '%s' status: %s", request.getTitle(), action);
        };
    }
}
