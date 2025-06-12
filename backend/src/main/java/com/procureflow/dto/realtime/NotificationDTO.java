package com.procureflow.dto.realtime;

import java.time.LocalDateTime;

/**
 * Real-time Notification DTO
 * Data transfer object for real-time notifications
 */
public class NotificationDTO {

    private String type;
    private String title;
    private String message;
    private Object data;
    private LocalDateTime timestamp;
    private String action;
    private String priority;
    private String userId;

    // Constructors
    public NotificationDTO() {}

    public NotificationDTO(String type, String title, String message) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
