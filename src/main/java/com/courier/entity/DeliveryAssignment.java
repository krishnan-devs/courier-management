package com.courier.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "delivery_assignments")
public class DeliveryAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shipment_id")
    private Shipment shipment;

    @ManyToOne
    @JoinColumn(name = "delivery_staff_id")
    private DeliveryStaff deliveryStaff;

    private String assignmentStatus;

    public DeliveryAssignment() {
    }

    public DeliveryAssignment(Long id,
                              Shipment shipment,
                              DeliveryStaff deliveryStaff,
                              String assignmentStatus) {
        this.id = id;
        this.shipment = shipment;
        this.deliveryStaff = deliveryStaff;
        this.assignmentStatus = assignmentStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Shipment getShipment() {
        return shipment;
    }

    public void setShipment(Shipment shipment) {
        this.shipment = shipment;
    }

    public DeliveryStaff getDeliveryStaff() {
        return deliveryStaff;
    }

    public void setDeliveryStaff(DeliveryStaff deliveryStaff) {
        this.deliveryStaff = deliveryStaff;
    }

    public String getAssignmentStatus() {
        return assignmentStatus;
    }

    public void setAssignmentStatus(String assignmentStatus) {
        this.assignmentStatus = assignmentStatus;
    }
}