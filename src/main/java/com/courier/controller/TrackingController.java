package com.courier.controller;

import com.courier.entity.Tracking;
import com.courier.service.TrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking-details")
@SecurityRequirement(name = "bearerAuth")
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    // Add tracking update
    @Operation(
            summary = "Add Tracking Update",
            description = "Add a new tracking update for a shipment"
    )
    @PostMapping
    public Tracking addTracking(@RequestBody Tracking tracking) {
        return trackingService.addTracking(tracking);
    }

    // Get all tracking records
    @Operation(
            summary = "Get All Tracking Records",
            description = "Retrieve all shipment tracking records"
    )
    @GetMapping
    public List<Tracking> getAllTracking() {
        return trackingService.getAllTracking();
    }

    // Get tracking by ID
    @Operation(
            summary = "Get Tracking by ID",
            description = "Retrieve a tracking record using its tracking ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Tracking> getTrackingById(
            @PathVariable Long id) {

        Tracking tracking = trackingService.getTrackingById(id);

        if (tracking == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(tracking);
    }

    // Get tracking history for a shipment
    @Operation(
            summary = "Get Shipment Tracking History",
            description = "Retrieve the complete tracking history for a specific shipment"
    )
    @GetMapping("/shipment/{shipmentId}")
    public List<Tracking> getTrackingByShipmentId(
            @PathVariable Long shipmentId) {

        return trackingService.getTrackingByShipmentId(shipmentId);
    }

    // Update tracking
    @Operation(
            summary = "Update Tracking",
            description = "Update an existing shipment tracking record using its tracking ID"
    )
    @PutMapping("/{id}")
    public ResponseEntity<Tracking> updateTracking(
            @PathVariable Long id,
            @RequestBody Tracking tracking) {

        Tracking updatedTracking =
                trackingService.updateTracking(id, tracking);

        if (updatedTracking == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedTracking);
    }

    // Delete tracking
    @Operation(
            summary = "Delete Tracking",
            description = "Delete an existing tracking record using its tracking ID"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTracking(
            @PathVariable Long id) {

        boolean deleted = trackingService.deleteTracking(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                "Tracking record deleted successfully"
        );
    }
}