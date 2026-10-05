package com.courier.service;

import com.courier.dto.AdminDashboardResponse;
import com.courier.repository.ShipmentRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminDashboardService {

    private final ShipmentRepository shipmentRepository;

    public AdminDashboardService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    public AdminDashboardResponse getDashboardData() {

        long totalShipments = shipmentRepository.count();

        long pendingShipments =
                shipmentRepository.countByStatusIgnoreCase("BOOKED");

        long inTransitShipments =
                shipmentRepository.countByStatusIgnoreCase("IN_TRANSIT");

        long deliveredShipments =
                shipmentRepository.countByStatusIgnoreCase("DELIVERED");

        long cancelledShipments =
                shipmentRepository.countByStatusIgnoreCase("CANCELLED");

        return new AdminDashboardResponse(
                totalShipments,
                pendingShipments,
                inTransitShipments,
                deliveredShipments,
                cancelledShipments
        );
    }
}