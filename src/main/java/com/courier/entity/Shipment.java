package com.courier.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "shipments")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customer;

    @Column(unique = true, nullable = false)
    private String trackingNumber;

    @NotBlank(message = "Sender name is required")
    @Size(
            min = 2,
            max = 100,
            message = "Sender name must be between 2 and 100 characters"
    )
    private String senderName;

    @NotBlank(message = "Sender phone is required")
    @Size(
            min = 10,
            max = 15,
            message = "Sender phone must be between 10 and 15 characters"
    )
    private String senderPhone;

    @NotBlank(message = "Receiver name is required")
    @Size(
            min = 2,
            max = 100,
            message = "Receiver name must be between 2 and 100 characters"
    )
    private String receiverName;

    @NotBlank(message = "Receiver phone is required")
    @Size(
            min = 10,
            max = 15,
            message = "Receiver phone must be between 10 and 15 characters"
    )
    private String receiverPhone;

    @NotBlank(message = "Pickup address is required")
    @Size(
            max = 255,
            message = "Pickup address cannot exceed 255 characters"
    )
    private String pickupAddress;

    @NotBlank(message = "Delivery address is required")
    @Size(
            max = 255,
            message = "Delivery address cannot exceed 255 characters"
    )
    private String deliveryAddress;

    @NotBlank(message = "Package description is required")
    @Size(
            max = 255,
            message = "Package description cannot exceed 255 characters"
    )
    private String packageDescription;

    @Positive(message = "Weight must be greater than 0")
    private Double weight;

    private String status;

    public Shipment() {
    }

    public Shipment(Long id,
                    String trackingNumber,
                    String senderName,
                    String senderPhone,
                    String receiverName,
                    String receiverPhone,
                    String pickupAddress,
                    String deliveryAddress,
                    String packageDescription,
                    Double weight,
                    String status) {

        this.id = id;
        this.trackingNumber = trackingNumber;
        this.senderName = senderName;
        this.senderPhone = senderPhone;
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.pickupAddress = pickupAddress;
        this.deliveryAddress = deliveryAddress;
        this.packageDescription = packageDescription;
        this.weight = weight;
        this.status = status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderPhone() {
        return senderPhone;
    }

    public void setSenderPhone(String senderPhone) {
        this.senderPhone = senderPhone;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getPackageDescription() {
        return packageDescription;
    }

    public void setPackageDescription(String packageDescription) {
        this.packageDescription = packageDescription;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}