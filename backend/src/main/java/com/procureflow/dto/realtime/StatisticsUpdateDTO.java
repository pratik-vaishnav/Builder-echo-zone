package com.procureflow.dto.realtime;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Statistics Update DTO
 * Real-time statistics data transfer object
 */
public class StatisticsUpdateDTO {

    private String type;
    private Map<String, Object> statistics;
    private LocalDateTime timestamp;

    // Constructors
    public StatisticsUpdateDTO() {}

    public StatisticsUpdateDTO(Map<String, Object> statistics) {
        this.statistics = statistics;
        this.timestamp = LocalDateTime.now();
        this.type = "STATISTICS_UPDATE";
    }

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Map<String, Object> getStatistics() { return statistics; }
    public void setStatistics(Map<String, Object> statistics) { this.statistics = statistics; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
