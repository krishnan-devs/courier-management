package com.courier.dto;

public class AdminDashboardResponse {

    private long totalShipments;
    private long pendingShipments;
    private long inTransitShipments;
    private long deliveredShipments;
    private long cancelledShipments;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(
            long totalShipments,
            long pendingShipments,
            long inTransitShipments,
            long deliveredShipments,
            long cancelledShipments) {

        this.totalShipments = totalShipments;
        this.pendingShipments = pendingShipments;
        this.inTransitShipments = inTransitShipments;
        this.deliveredShipments = deliveredShipments;
        this.cancelledShipments = cancelledShipments;
    }

    public long getTotalShipments() {
        return totalShipments;
    }

    public void setTotalShipments(long totalShipments) {
        this.totalShipments = totalShipments;
    }

    public long getPendingShipments() {
        return pendingShipments;
    }

    public void setPendingShipments(long pendingShipments) {
        this.pendingShipments = pendingShipments;
    }

    public long getInTransitShipments() {
        return inTransitShipments;
    }

    public void setInTransitShipments(long inTransitShipments) {
        this.inTransitShipments = inTransitShipments;
    }

    public long getDeliveredShipments() {
        return deliveredShipments;
    }

    public void setDeliveredShipments(long deliveredShipments) {
        this.deliveredShipments = deliveredShipments;
    }

    public long getCancelledShipments() {
        return cancelledShipments;
    }

    public void setCancelledShipments(long cancelledShipments) {
        this.cancelledShipments = cancelledShipments;
    }
}