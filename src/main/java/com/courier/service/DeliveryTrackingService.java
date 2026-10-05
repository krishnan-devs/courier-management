package com.courier.service;

import com.courier.dto.DeliveryTrackingResponse;
import com.courier.entity.Delivery;
import com.courier.entity.Shipment;
import com.courier.entity.Staff;
import com.courier.repository.DeliveryRepository;
import com.courier.repository.ShipmentRepository;
import org.springframework.stereotype.Service;

@Service
public class DeliveryTrackingService {

    private final ShipmentRepository shipmentRepository;
    private final DeliveryRepository deliveryRepository;

    public DeliveryTrackingService(ShipmentRepository shipmentRepository,
                                   DeliveryRepository deliveryRepository) {
        this.shipmentRepository = shipmentRepository;
        this.deliveryRepository = deliveryRepository;
    }

    public DeliveryTrackingResponse trackShipment(String trackingNumber) {

        Shipment shipment = shipmentRepository
                .findByTrackingNumber(trackingNumber)
                .orElse(null);

        if (shipment == null) {
            return null;
        }

        Delivery delivery = deliveryRepository
                .findByShipmentId(shipment.getId())
                .orElse(null);

        if (delivery == null) {
            return new DeliveryTrackingResponse(
                    shipment.getTrackingNumber(),
                    "NOT_ASSIGNED",
                    null,
                    null,
                    null,
                    null
            );
        }

        Staff staff = delivery.getStaff();

        String staffName = null;
        String staffPhone = null;

        if (staff != null) {
            staffName = staff.getName();
            staffPhone = staff.getPhone();
        }

        return new DeliveryTrackingResponse(
                shipment.getTrackingNumber(),
                delivery.getDeliveryStatus(),
                staffName,
                staffPhone,
                delivery.getAssignedAt() != null
                        ? delivery.getAssignedAt().toString()
                        : null,
                delivery.getDeliveredAt() != null
                        ? delivery.getDeliveredAt().toString()
                        : null
        );
    }
}