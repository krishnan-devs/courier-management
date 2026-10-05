package com.courier.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tracking")
public class Tracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;

    private String location;

    private String description;

    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "shipment_id")
    private Shipment shipment;

    public Tracking() {
    }

    public Tracking(Long id, String status, String location,
                    String description, LocalDateTime updatedAt,
                    Shipment shipment) {
        this.id = id;
        this.status = status;
        this.location = location;
        this.description = description;
        this.updatedAt = updatedAt;
        this.shipment = shipment;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Shipment getShipment() {
        return shipment;
    }

    public void setShipment(Shipment shipment) {
        this.shipment = shipment;
    }
}