package com.courier.controller;

import com.courier.entity.Shipment;
import com.courier.security.CustomUserDetailsService;
import com.courier.security.JwtService;
import com.courier.service.ShipmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ShipmentController.class)
@AutoConfigureMockMvc(addFilters = false)
class ShipmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ShipmentService shipmentService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    private Shipment shipment;

    @BeforeEach
    void setUp() {

        shipment = new Shipment();

        shipment.setId(1L);
        shipment.setTrackingNumber("TRK-12345678");
        shipment.setSenderName("Krishnan");
        shipment.setSenderPhone("9876543210");
        shipment.setReceiverName("Ravi");
        shipment.setReceiverPhone("9876501234");
        shipment.setPickupAddress("Chennai");
        shipment.setDeliveryAddress("Bangalore");
        shipment.setPackageDescription("Documents");
        shipment.setWeight(2.0);
        shipment.setStatus("BOOKED");
    }

    @Test
    void testCreateShipment() throws Exception {

        when(shipmentService.createShipment(any(Shipment.class)))
                .thenReturn(shipment);

        mockMvc.perform(post("/api/shipments")
                        .contentType("application/json")
                        .content("""
                                {
                                  "senderName": "Krishnan",
                                  "senderPhone": "9876543210",
                                  "receiverName": "Ravi",
                                  "receiverPhone": "9876501234",
                                  "pickupAddress": "Chennai",
                                  "deliveryAddress": "Bangalore",
                                  "packageDescription": "Documents",
                                  "weight": 2.0
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message")
                        .value("Shipment created successfully"))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.trackingNumber")
                        .value("TRK-12345678"))
                .andExpect(jsonPath("$.data.status")
                        .value("BOOKED"));
    }

    @Test
    void testGetAllShipments() throws Exception {

        when(shipmentService.getAllShipments())
                .thenReturn(List.of(shipment));

        mockMvc.perform(get("/api/shipments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].trackingNumber")
                        .value("TRK-12345678"))
                .andExpect(jsonPath("$.data[0].senderName")
                        .value("Krishnan"));
    }

    @Test
    void testGetShipmentById() throws Exception {

        when(shipmentService.getShipmentById(1L))
                .thenReturn(Optional.of(shipment));

        mockMvc.perform(get("/api/shipments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.trackingNumber")
                        .value("TRK-12345678"));
    }

    @Test
    void testGetShipmentByIdNotFound() throws Exception {

        when(shipmentService.getShipmentById(999L))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/shipments/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message")
                        .value("Shipment not found"))
                .andExpect(jsonPath("$.data").doesNotExist());
    }

    @Test
    void testGetShipmentByTrackingNumber() throws Exception {

        when(shipmentService
                .getShipmentByTrackingNumber("TRK-12345678"))
                .thenReturn(Optional.of(shipment));

        mockMvc.perform(
                        get("/api/shipments/tracking/TRK-12345678"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.trackingNumber")
                        .value("TRK-12345678"))
                .andExpect(jsonPath("$.data.status")
                        .value("BOOKED"));
    }

    @Test
    void testUpdateShipment() throws Exception {

        when(shipmentService.updateShipment(
                eq(1L),
                any(Shipment.class)
        )).thenReturn(shipment);

        mockMvc.perform(put("/api/shipments/1")
                        .contentType("application/json")
                        .content("""
                                {
                                  "senderName": "Updated Sender",
                                  "senderPhone": "9999999999",
                                  "receiverName": "Updated Receiver",
                                  "receiverPhone": "8888888888",
                                  "pickupAddress": "Chennai",
                                  "deliveryAddress": "Coimbatore",
                                  "packageDescription": "Laptop",
                                  "weight": 2.0
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message")
                        .value("Shipment updated successfully"))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.trackingNumber")
                        .value("TRK-12345678"));
    }

    @Test
    void testUpdateShipmentNotFound() throws Exception {

        when(shipmentService.updateShipment(
                eq(999L),
                any(Shipment.class)
        )).thenThrow(
                new com.courier.exception.ShipmentNotFoundException(
                        "Shipment not found with id: 999"
                )
        );

        mockMvc.perform(put("/api/shipments/999")
                        .contentType("application/json")
                        .content("""
                                {
                                  "senderName": "Updated Sender",
                                  "senderPhone": "9999999999",
                                  "receiverName": "Updated Receiver",
                                  "receiverPhone": "8888888888",
                                  "pickupAddress": "Chennai",
                                  "deliveryAddress": "Coimbatore",
                                  "packageDescription": "Laptop",
                                  "weight": 2.0
                                }
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message")
                        .value("Shipment not found with id: 999"))
                .andExpect(jsonPath("$.data").doesNotExist());
    }

    @Test
    void testDeleteShipment() throws Exception {

        when(shipmentService.deleteShipment(1L))
                .thenReturn(true);

        mockMvc.perform(delete("/api/shipments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message")
                        .value("Shipment deleted successfully"))
                .andExpect(jsonPath("$.data").doesNotExist());
    }

    @Test
    void testDeleteShipmentNotFound() throws Exception {

        when(shipmentService.deleteShipment(999L))
                .thenThrow(
                        new com.courier.exception.ShipmentNotFoundException(
                                "Shipment not found with id: 999"
                        )
                );

        mockMvc.perform(delete("/api/shipments/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message")
                        .value("Shipment not found with id: 999"))
                .andExpect(jsonPath("$.data").doesNotExist());
    }
}