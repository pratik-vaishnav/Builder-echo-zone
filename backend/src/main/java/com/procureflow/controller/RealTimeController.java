package com.procureflow.controller;

import com.procureflow.dto.realtime.NotificationDTO;
import com.procureflow.service.PurchaseRequestService;
import com.procureflow.service.RealTimeNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Real-time WebSocket Controller
 * Handles WebSocket communication for real-time updates
 */
@RestController
@RequestMapping("/api/realtime")
@Tag(name = "Real-time Communication", description = "WebSocket-based real-time APIs")
public class RealTimeController {

    @Autowired
    private RealTimeNotificationService notificationService;

    @Autowired
    private PurchaseRequestService purchaseRequestService;

    /**
     * Handle client heartbeat messages
     */
    @MessageMapping("/heartbeat")
    @SendTo("/topic/heartbeat")
    public Map<String, Object> handleHeartbeat(Map<String, Object> message) {
        return Map.of(
            "type", "heartbeat_response",
            "timestamp", LocalDateTime.now(),
            "status", "connected"
        );
    }

    /**
     * Handle client subscription to purchase request updates
     */
    @MessageMapping("/subscribe/purchase-requests")
    @SendToUser("/queue/confirmation")
    public NotificationDTO subscribeToPurchaseRequests() {
        return new NotificationDTO(
            "SUBSCRIPTION_CONFIRMED",
            "Subscribed to Purchase Requests",
            "You will receive real-time updates for purchase requests"
        );
    }

    /**
     * Handle client subscription to dashboard updates
     */
    @MessageMapping("/subscribe/dashboard")
    @SendToUser("/queue/confirmation")
    public NotificationDTO subscribeToDashboard() {
        return new NotificationDTO(
            "SUBSCRIPTION_CONFIRMED",
            "Subscribed to Dashboard",
            "You will receive real-time dashboard updates"
        );
    }

    /**
     * REST endpoint to trigger test notification (for development)
     */
    @PostMapping("/test-notification")
    @Operation(summary = "Send test notification", description = "Send a test real-time notification")
    public ResponseEntity<String> sendTestNotification(@RequestParam String message) {
        NotificationDTO notification = new NotificationDTO(
            "TEST_NOTIFICATION",
            "Test Notification",
            message
        );
        notification.setTimestamp(LocalDateTime.now());
        
        notificationService.sendPersonalNotification("demo", notification);
        
        return ResponseEntity.ok("Test notification sent");
    }

    /**
     * REST endpoint to get current statistics (for initial load)
     */
    @GetMapping("/statistics")
    @Operation(summary = "Get current statistics", description = "Get current real-time statistics")
    public ResponseEntity<Map<String, Object>> getCurrentStatistics() {
        Map<String, Object> statistics = purchaseRequestService.getStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * REST endpoint to trigger statistics broadcast (for development)
     */
    @PostMapping("/broadcast-statistics")
    @Operation(summary = "Broadcast statistics", description = "Manually trigger statistics broadcast")
    public ResponseEntity<String> broadcastStatistics() {
        Map<String, Object> statistics = purchaseRequestService.getStatistics();
        notificationService.broadcastStatisticsUpdate(statistics);
        
        return ResponseEntity.ok("Statistics broadcast sent");
    }

    /**
     * REST endpoint to simulate workflow update
     */
    @PostMapping("/simulate-workflow")
    @Operation(summary = "Simulate workflow update", description = "Simulate a workflow status change")
    public ResponseEntity<String> simulateWorkflowUpdate(
            @RequestParam Long requestId,
            @RequestParam String fromStatus,
            @RequestParam String toStatus,
            @RequestParam(defaultValue = "Manual simulation") String reason) {
        
        notificationService.broadcastWorkflowUpdate(requestId, fromStatus, toStatus, reason);
        
        return ResponseEntity.ok("Workflow update simulated");
    }

    /**
     * REST endpoint to simulate purchase order creation
     */
    @PostMapping("/simulate-po-creation")
    @Operation(summary = "Simulate PO creation", description = "Simulate purchase order creation")
    public ResponseEntity<String> simulatePOCreation(
            @RequestParam Long requestId,
            @RequestParam String orderNumber,
            @RequestParam String supplierName) {
        
        notificationService.broadcastPurchaseOrderCreated(requestId, orderNumber, supplierName);
        
        return ResponseEntity.ok("Purchase order creation simulated");
    }

    // Simple response wrapper
    public static class ResponseEntity<T> {
        private final T body;
        private final int status;

        private ResponseEntity(T body, int status) {
            this.body = body;
            this.status = status;
        }

        public static <T> ResponseEntity<T> ok(T body) {
            return new ResponseEntity<>(body, 200);
        }

        public T getBody() { return body; }
        public int getStatus() { return status; }
    }
}
