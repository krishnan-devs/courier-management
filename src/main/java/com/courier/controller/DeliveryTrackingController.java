package com.courier.controller;

import com.courier.dto.DeliveryTrackingResponse;
import com.courier.service.DeliveryTrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracking")
@SecurityRequirement(name = "bearerAuth")
public class DeliveryTrackingController {

    private final DeliveryTrackingService deliveryTrackingService;

    public DeliveryTrackingController(DeliveryTrackingService deliveryTrackingService) {
        this.deliveryTrackingService = deliveryTrackingService;
    }

    @Operation(
            summary = "Track Shipment",
            description = "Retrieve the current delivery tracking information using the shipment tracking number"
    )
    @GetMapping("/{trackingNumber}")
    public ResponseEntity<?> trackShipment(
            @PathVariable String trackingNumber) {

        DeliveryTrackingResponse response =
                deliveryTrackingService.trackShipment(trackingNumber);

        if (response == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(response);
    }
}