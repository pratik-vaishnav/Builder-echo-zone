package com.procureflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;

import java.math.BigDecimal;

/**
 * Request Item Entity
 * Represents individual items within a purchase request
 */
@Entity
@Table(name = "request_items")
public class RequestItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "description")
    private String description;

    @NotNull
    @Min(value = 1)
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications;

    @Column(name = "preferred_supplier")
    private String preferredSupplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_request_id", nullable = false)
    private PurchaseRequest purchaseRequest;

    // Constructors
    public RequestItem() {}

    public RequestItem(String itemName, Integer quantity, BigDecimal unitPrice) {
        this.itemName = itemName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { 
        this.quantity = quantity;
        updateTotalPrice();
    }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { 
        this.unitPrice = unitPrice;
        updateTotalPrice();
    }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }

    public String getPreferredSupplier() { return preferredSupplier; }
    public void setPreferredSupplier(String preferredSupplier) { this.preferredSupplier = preferredSupplier; }

    public PurchaseRequest getPurchaseRequest() { return purchaseRequest; }
    public void setPurchaseRequest(PurchaseRequest purchaseRequest) { this.purchaseRequest = purchaseRequest; }

    // Utility methods
    private void updateTotalPrice() {
        if (quantity != null && unitPrice != null) {
            this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }

    @PrePersist
    @PreUpdate
    private void calculateTotalPrice() {
        updateTotalPrice();
    }
}
