package com.courier.service;

import com.courier.entity.Delivery;
import com.courier.repository.DeliveryRepository;
import com.courier.repository.ShipmentRepository;
import org.springframework.stereotype.Service;

import com.courier.exception.DeliveryNotFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.courier.entity.Shipment;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    private final NotificationService notificationService;

    private final ShipmentRepository shipmentRepository;

    public DeliveryService(
            DeliveryRepository deliveryRepository,
            NotificationService notificationService,
            ShipmentRepository shipmentRepository) {

        this.deliveryRepository = deliveryRepository;
        this.notificationService = notificationService;
        this.shipmentRepository = shipmentRepository;
    }


    // Create Delivery
    public Delivery createDelivery(Delivery delivery) {

        return deliveryRepository.save(delivery);
    }


    // Get All Deliveries
    public List<Delivery> getAllDeliveries() {

        return deliveryRepository.findAll();
    }


    // Get Deliveries Assigned To A Staff Member
    public List<Delivery> getDeliveriesByStaffId(Long staffId) {

        return deliveryRepository.findByStaffId(staffId);
    }


    // Get Delivery By ID
    public Optional<Delivery> getDeliveryById(Long id) {

        return deliveryRepository.findById(id);
    }

    // Update Delivery Status
    public Delivery updateDeliveryStatus(
            Long id,
            String status) {

        Optional<Delivery> optionalDelivery =
                deliveryRepository.findById(id);

        if (optionalDelivery.isEmpty()) {

            throw new DeliveryNotFoundException(
                    "Delivery not found with id: " + id
            );
        }

        Delivery delivery = optionalDelivery.get();

        delivery.setDeliveryStatus(status);

        if (delivery.getShipment() != null) {

            Shipment shipment = delivery.getShipment();

            shipment.setStatus(status);

            shipmentRepository.save(shipment);
        }


        // Set delivered time when status becomes DELIVERED
        if ("DELIVERED".equalsIgnoreCase(status)) {

            delivery.setDeliveredAt(
                    LocalDateTime.now()
            );


            // Create notification
            if (delivery.getShipment() != null) {

                String receiverName =
                        delivery.getShipment()
                                .getReceiverName();

                String trackingNumber =
                        delivery.getShipment()
                                .getTrackingNumber();


                notificationService.createNotification(
                        1L,
                        "Shipment Delivered",
                        "Hello " + receiverName
                                + ", your shipment "
                                + trackingNumber
                                + " has been delivered successfully."
                );
            }
        }


        return deliveryRepository.save(delivery);
    }

    // Update Delivery
    public Delivery updateDelivery(
            Long id,
            Delivery deliveryDetails) {

        Optional<Delivery> optionalDelivery =
                deliveryRepository.findById(id);

        if (optionalDelivery.isPresent()) {

            Delivery delivery = optionalDelivery.get();

            delivery.setShipment(
                    deliveryDetails.getShipment()
            );

            delivery.setStaff(
                    deliveryDetails.getStaff()
            );

            delivery.setDeliveryStatus(
                    deliveryDetails.getDeliveryStatus()
            );

            delivery.setAssignedAt(
                    deliveryDetails.getAssignedAt()
            );


            if ("DELIVERED".equalsIgnoreCase(
                    deliveryDetails.getDeliveryStatus())) {

                delivery.setDeliveredAt(
                        LocalDateTime.now()
                );

            } else {

                delivery.setDeliveredAt(
                        deliveryDetails.getDeliveredAt()
                );
            }


            Delivery savedDelivery =
                    deliveryRepository.save(delivery);


            // Create notification when shipment is delivered
            if ("DELIVERED".equalsIgnoreCase(
                    deliveryDetails.getDeliveryStatus())) {

                if (delivery.getShipment() != null) {

                    String receiverName =
                            delivery.getShipment()
                                    .getReceiverName();

                    String trackingNumber =
                            delivery.getShipment()
                                    .getTrackingNumber();


                    notificationService.createNotification(
                            1L,
                            "Shipment Delivered",
                            "Hello " + receiverName
                                    + ", your shipment "
                                    + trackingNumber
                                    + " has been delivered successfully."
                    );
                }
            }


            return savedDelivery;
        }


        throw new DeliveryNotFoundException(
                "Delivery not found with id: " + id
        );
    }


    // Delete Delivery
    public void deleteDelivery(Long id) {

        if (!deliveryRepository.existsById(id)) {

            throw new DeliveryNotFoundException(
                    "Delivery not found with id: " + id
            );
        }

        deliveryRepository.deleteById(id);
    }
}