package com.courier.dto;

public class DeliveryTrackingResponse {

    private String trackingNumber;
    private String deliveryStatus;
    private String staffName;
    private String staffPhone;
    private String assignedAt;
    private String deliveredAt;

    public DeliveryTrackingResponse() {
    }

    public DeliveryTrackingResponse(String trackingNumber,
                                    String deliveryStatus,
                                    String staffName,
                                    String staffPhone,
                                    String assignedAt,
                                    String deliveredAt) {
        this.trackingNumber = trackingNumber;
        this.deliveryStatus = deliveryStatus;
        this.staffName = staffName;
        this.staffPhone = staffPhone;
        this.assignedAt = assignedAt;
        this.deliveredAt = deliveredAt;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public String getStaffPhone() {
        return staffPhone;
    }

    public void setStaffPhone(String staffPhone) {
        this.staffPhone = staffPhone;
    }

    public String getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(String assignedAt) {
        this.assignedAt = assignedAt;
    }

    public String getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(String deliveredAt) {
        this.deliveredAt = deliveredAt;
    }
}