package com.procureflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Approval Entity
 * Represents approval/rejection records for purchase requests
 */
@Entity
@Table(name = "approvals")
@EntityListeners(AuditingEntityListener.class)
public class Approval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ApprovalStatus status;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_request_id", nullable = false)
    private PurchaseRequest purchaseRequest;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id", nullable = false)
    private User approver;

    @Column(name = "approval_level")
    private Integer approvalLevel;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Approval() {}

    public Approval(PurchaseRequest purchaseRequest, User approver, ApprovalStatus status) {
        this.purchaseRequest = purchaseRequest;
        this.approver = approver;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ApprovalStatus getStatus() { return status; }
    public void setStatus(ApprovalStatus status) { this.status = status; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public PurchaseRequest getPurchaseRequest() { return purchaseRequest; }
    public void setPurchaseRequest(PurchaseRequest purchaseRequest) { this.purchaseRequest = purchaseRequest; }

    public User getApprover() { return approver; }
    public void setApprover(User approver) { this.approver = approver; }

    public Integer getApprovalLevel() { return approvalLevel; }
    public void setApprovalLevel(Integer approvalLevel) { this.approvalLevel = approvalLevel; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
