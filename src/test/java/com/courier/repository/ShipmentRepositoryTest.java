package com.courier.repository;

import com.courier.entity.Shipment;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class ShipmentRepositoryTest {

    @Autowired
    private ShipmentRepository shipmentRepository;

    private Shipment shipment;

    @BeforeEach
    void setUp() {

        shipmentRepository.deleteAll();

        shipment = new Shipment();

        shipment.setSenderName("Krishnan");
        shipment.setSenderPhone("9876543210");
        shipment.setReceiverName("Ravi");
        shipment.setReceiverPhone("9876501234");
        shipment.setPickupAddress("Chennai");
        shipment.setDeliveryAddress("Bangalore");
        shipment.setPackageDescription("Documents");
        shipment.setWeight(2.0);
        shipment.setTrackingNumber("TRK-12345678");
        shipment.setStatus("BOOKED");

        shipmentRepository.save(shipment);
    }

    @Test
    void testFindByTrackingNumber() {

        Optional<Shipment> result =
                shipmentRepository.findByTrackingNumber(
                        "TRK-12345678"
                );

        assertTrue(result.isPresent());

        assertEquals(
                "TRK-12345678",
                result.get().getTrackingNumber()
        );

        assertEquals(
                "Krishnan",
                result.get().getSenderName()
        );
    }

    @Test
    void testFindByTrackingNumberNotFound() {

        Optional<Shipment> result =
                shipmentRepository.findByTrackingNumber(
                        "TRK-99999999"
                );

        assertTrue(result.isEmpty());
    }

    @Test
    void testCountByStatus() {

        long count =
                shipmentRepository.countByStatus("BOOKED");

        assertEquals(1, count);
    }

    @Test
    void testCountByStatusIgnoreCase() {

        long count =
                shipmentRepository.countByStatusIgnoreCase(
                        "booked"
                );

        assertEquals(1, count);
    }

    @Test
    void testSaveShipment() {

        Shipment savedShipment =
                shipmentRepository.save(shipment);

        assertNotNull(savedShipment.getId());

        assertEquals(
                "Chennai",
                savedShipment.getPickupAddress()
        );

        assertEquals(
                "Bangalore",
                savedShipment.getDeliveryAddress()
        );
    }
}