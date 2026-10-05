package com.courier.service;

import com.courier.entity.Shipment;
import com.courier.exception.ShipmentNotFoundException;
import com.courier.repository.ShipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShipmentServiceTest {

    @Mock
    private ShipmentRepository shipmentRepository;

    @InjectMocks
    private ShipmentService shipmentService;

    private Shipment shipment;

    @BeforeEach
    void setUp() {

        shipment = new Shipment();

        shipment.setId(1L);
        shipment.setSenderName("Krishnan");
        shipment.setSenderPhone("9876543210");
        shipment.setReceiverName("Ravi");
        shipment.setReceiverPhone("9876501234");
        shipment.setPickupAddress("Chennai");
        shipment.setDeliveryAddress("Bangalore");
        shipment.setPackageDescription("Documents");
        shipment.setWeight(2.0);
    }

    @Test
    void testCreateShipment() {

        when(shipmentRepository.save(any(Shipment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Shipment result = shipmentService.createShipment(shipment);

        assertNotNull(result);
        assertNotNull(result.getTrackingNumber());
        assertTrue(result.getTrackingNumber().startsWith("TRK-"));
        assertEquals("BOOKED", result.getStatus());

        verify(shipmentRepository, times(1))
                .save(shipment);
    }

    @Test
    void testGetAllShipments() {

        when(shipmentRepository.findAll())
                .thenReturn(List.of(shipment));

        List<Shipment> result =
                shipmentService.getAllShipments();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Krishnan",
                result.get(0).getSenderName());

        verify(shipmentRepository, times(1))
                .findAll();
    }

    @Test
    void testGetShipmentById() {

        when(shipmentRepository.findById(1L))
                .thenReturn(Optional.of(shipment));

        Optional<Shipment> result =
                shipmentService.getShipmentById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());

        verify(shipmentRepository, times(1))
                .findById(1L);
    }

    @Test
    void testGetShipmentByTrackingNumber() {

        shipment.setTrackingNumber("TRK-12345678");

        when(shipmentRepository
                .findByTrackingNumber("TRK-12345678"))
                .thenReturn(Optional.of(shipment));

        Optional<Shipment> result =
                shipmentService.getShipmentByTrackingNumber(
                        "TRK-12345678"
                );

        assertTrue(result.isPresent());
        assertEquals(
                "TRK-12345678",
                result.get().getTrackingNumber()
        );

        verify(shipmentRepository, times(1))
                .findByTrackingNumber("TRK-12345678");
    }

    @Test
    void testUpdateShipment() {

        Shipment updatedShipment = new Shipment();

        updatedShipment.setSenderName("New Sender");
        updatedShipment.setSenderPhone("9999999999");
        updatedShipment.setReceiverName("New Receiver");
        updatedShipment.setReceiverPhone("8888888888");
        updatedShipment.setPickupAddress("Chennai");
        updatedShipment.setDeliveryAddress("Coimbatore");
        updatedShipment.setPackageDescription("Laptop");

        when(shipmentRepository.findById(1L))
                .thenReturn(Optional.of(shipment));

        when(shipmentRepository.save(any(Shipment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Shipment result =
                shipmentService.updateShipment(
                        1L,
                        updatedShipment
                );

        assertNotNull(result);
        assertEquals("New Sender", result.getSenderName());
        assertEquals("New Receiver", result.getReceiverName());
        assertEquals("Coimbatore", result.getDeliveryAddress());
        assertEquals("Laptop", result.getPackageDescription());

        verify(shipmentRepository, times(1))
                .findById(1L);

        verify(shipmentRepository, times(1))
                .save(shipment);
    }

    @Test
    void testUpdateShipmentWhenShipmentDoesNotExist() {

        when(shipmentRepository.findById(999L))
                .thenReturn(Optional.empty());

        ShipmentNotFoundException exception =
                assertThrows(
                        ShipmentNotFoundException.class,
                        () -> shipmentService.updateShipment(
                                999L,
                                shipment
                        )
                );

        assertEquals(
                "Shipment not found with id: 999",
                exception.getMessage()
        );

        verify(shipmentRepository)
                .findById(999L);

        verify(shipmentRepository, never())
                .save(any(Shipment.class));
    }

    @Test
    void testDeleteShipment() {

        when(shipmentRepository.existsById(1L))
                .thenReturn(true);

        boolean result =
                shipmentService.deleteShipment(1L);

        assertTrue(result);

        verify(shipmentRepository, times(1))
                .existsById(1L);

        verify(shipmentRepository, times(1))
                .deleteById(1L);
    }

    @Test
    void testDeleteShipmentWhenShipmentDoesNotExist() {

        when(shipmentRepository.existsById(999L))
                .thenReturn(false);

        ShipmentNotFoundException exception =
                assertThrows(
                        ShipmentNotFoundException.class,
                        () -> shipmentService.deleteShipment(999L)
                );

        assertEquals(
                "Shipment not found with id: 999",
                exception.getMessage()
        );

        verify(shipmentRepository)
                .existsById(999L);

        verify(shipmentRepository, never())
                .deleteById(999L);
    }
}
