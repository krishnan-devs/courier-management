package com.courier.service;

import com.courier.entity.Shipment;
import com.courier.repository.ShipmentRepository;
import org.springframework.stereotype.Service;
import com.courier.exception.ShipmentNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.courier.entity.Customer;
import com.courier.repository.CustomerRepository;

@Service
public class ShipmentService {

    private static final Logger logger =
            LoggerFactory.getLogger(ShipmentService.class);

    private final ShipmentRepository shipmentRepository;
    private final CustomerRepository customerRepository;

    public ShipmentService(
            ShipmentRepository shipmentRepository,
            CustomerRepository customerRepository) {

        this.shipmentRepository = shipmentRepository;
        this.customerRepository = customerRepository;
    }

    public List<Shipment> getCustomerShipments(String email) {

        logger.info(
                "Fetching shipments for customer: {}",
                email
        );

        Customer customer = customerRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found with email: " + email
                        )
                );

        return shipmentRepository.findByCustomer(customer);
    }

    // Get shipments with pagination and sorting
    public Page<Shipment> getShipments(Pageable pageable) {

        logger.info(
                "Fetching shipments - page: {}, size: {}",
                pageable.getPageNumber(),
                pageable.getPageSize()
        );

        return shipmentRepository.findAll(pageable);
    }

    // Create shipment
    public Shipment createShipment(Shipment shipment) {

        logger.info(
                "Creating shipment for sender: {}",
                shipment.getSenderName()
        );

        String trackingNumber = "TRK-" +
                UUID.randomUUID().toString()
                        .substring(0, 8)
                        .toUpperCase();

        shipment.setTrackingNumber(trackingNumber);
        shipment.setStatus("BOOKED");

        Shipment savedShipment =
                shipmentRepository.save(shipment);

        logger.info(
                "Shipment created successfully with tracking number: {}",
                trackingNumber
        );

        return savedShipment;
    }

    public Shipment createCustomerShipment(
            Shipment shipment,
            String email) {

        logger.info(
                "Creating shipment for customer: {}",
                email
        );

        Customer customer = customerRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found with email: " + email
                        )
                );

        String trackingNumber = "TRK-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        shipment.setTrackingNumber(trackingNumber);
        shipment.setStatus("BOOKED");

        // Link shipment to logged-in customer
        shipment.setCustomer(customer);

        Shipment savedShipment =
                shipmentRepository.save(shipment);

        logger.info(
                "Customer shipment created successfully with tracking number: {}",
                trackingNumber
        );

        return savedShipment;
    }

    // Get all shipments
    public List<Shipment> getAllShipments() {

        logger.info("Fetching all shipments");

        return shipmentRepository.findAll();
    }

    // Get shipment by ID
    public Optional<Shipment> getShipmentById(Long id) {

        logger.info(
                "Fetching shipment with id: {}",
                id
        );

        return shipmentRepository.findById(id);
    }

    // Get shipment by tracking number
    public Optional<Shipment> getShipmentByTrackingNumber(
            String trackingNumber) {

        logger.info(
                "Fetching shipment with tracking number: {}",
                trackingNumber
        );

        return shipmentRepository.findByTrackingNumber(
                trackingNumber
        );
    }

    // Update shipment
    public Shipment updateShipment(
            Long id,
            Shipment updatedShipment) {

        logger.info(
                "Updating shipment with id: {}",
                id
        );

        Optional<Shipment> existingShipment =
                shipmentRepository.findById(id);

        if (existingShipment.isEmpty()) {

            logger.warn(
                    "Shipment not found with id: {}",
                    id
            );

            throw new ShipmentNotFoundException(
                    "Shipment not found with id: " + id
            );
        }

        Shipment shipment = existingShipment.get();

        shipment.setSenderName(
                updatedShipment.getSenderName()
        );

        shipment.setSenderPhone(
                updatedShipment.getSenderPhone()
        );

        shipment.setReceiverName(
                updatedShipment.getReceiverName()
        );

        shipment.setReceiverPhone(
                updatedShipment.getReceiverPhone()
        );

        shipment.setPickupAddress(
                updatedShipment.getPickupAddress()
        );

        shipment.setDeliveryAddress(
                updatedShipment.getDeliveryAddress()
        );

        shipment.setPackageDescription(
                updatedShipment.getPackageDescription()
        );

        Shipment savedShipment =
                shipmentRepository.save(shipment);

        logger.info(
                "Shipment updated successfully with id: {}",
                id
        );

        return savedShipment;
    }

    // Delete shipment
    public boolean deleteShipment(Long id) {

        logger.info(
                "Deleting shipment with id: {}",
                id
        );

        if (!shipmentRepository.existsById(id)) {

            logger.warn(
                    "Cannot delete shipment. Shipment not found with id: {}",
                    id
            );

            throw new ShipmentNotFoundException(
                    "Shipment not found with id: " + id
            );
        }

        shipmentRepository.deleteById(id);

        logger.info(
                "Shipment deleted successfully with id: {}",
                id
        );

        return true;
    }
}