package com.courier;

import com.courier.entity.Shipment;
import com.courier.repository.ShipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class ShipmentIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @BeforeEach
    void setUp() {
        shipmentRepository.deleteAll();
    }

    @Test
    void testCreateShipmentIntegration() throws Exception {

        String json = """
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
            """;

        mockMvc.perform(
                        post("/api/shipments")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.trackingNumber").exists())
                .andExpect(jsonPath("$.data.status").value("BOOKED"));

        assertEquals(1, shipmentRepository.count());
    }

    @Test
    void testGetAllShipmentsIntegration() throws Exception {

        Shipment shipment = createShipment();

        shipmentRepository.save(shipment);

        mockMvc.perform(
                        get("/api/shipments")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].senderName")
                        .value("Krishnan"))
                .andExpect(jsonPath("$.data[0].trackingNumber")
                        .value("TRK-12345678"));
    }

    @Test
    void testGetShipmentByIdIntegration() throws Exception {

        Shipment shipment = createShipment();

        Shipment savedShipment =
                shipmentRepository.save(shipment);

        mockMvc.perform(
                        get("/api/shipments/"
                                + savedShipment.getId())
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id")
                        .value(savedShipment.getId()))
                .andExpect(jsonPath("$.data.trackingNumber")
                        .value("TRK-12345678"));
    }

    @Test
    void testGetShipmentByIdNotFoundIntegration()
            throws Exception {

        mockMvc.perform(
                        get("/api/shipments/99999")
                )
                .andExpect(status().isNotFound());
    }

    private Shipment createShipment() {

        Shipment shipment = new Shipment();

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

        return shipment;
    }
}