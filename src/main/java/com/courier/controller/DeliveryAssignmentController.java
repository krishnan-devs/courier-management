package com.courier.controller;

import com.courier.entity.DeliveryAssignment;
import com.courier.service.DeliveryAssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@SecurityRequirement(name = "bearerAuth")
public class DeliveryAssignmentController {

    private final DeliveryAssignmentService assignmentService;

    public DeliveryAssignmentController(
            DeliveryAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @Operation(
            summary = "Assign Shipment",
            description = "Assign a shipment to a delivery staff member using shipment ID and delivery staff ID"
    )
    @PostMapping("/assign")
    public ResponseEntity<?> assignShipment(
            @RequestParam Long shipmentId,
            @RequestParam Long deliveryStaffId) {

        DeliveryAssignment assignment =
                assignmentService.assignShipment(
                        shipmentId,
                        deliveryStaffId
                );

        if (assignment == null) {
            return ResponseEntity.badRequest()
                    .body("Shipment or Delivery Staff not found");
        }

        return ResponseEntity.ok(assignment);
    }

    @Operation(
            summary = "Get All Assignments",
            description = "Retrieve all shipment delivery assignments"
    )
    @GetMapping
    public List<DeliveryAssignment> getAllAssignments() {
        return assignmentService.getAllAssignments();
    }

    @Operation(
            summary = "Get Assignment by ID",
            description = "Retrieve a delivery assignment using its assignment ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryAssignment> getAssignmentById(
            @PathVariable Long id) {

        return assignmentService.getAssignmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Get Assignments by Staff",
            description = "Retrieve all delivery assignments associated with a delivery staff member"
    )
    @GetMapping("/staff/{staffId}")
    public List<DeliveryAssignment> getAssignmentsByStaff(
            @PathVariable Long staffId) {

        return assignmentService.getAssignmentsByStaff(staffId);
    }

    @Operation(
            summary = "Get Assignments by Shipment",
            description = "Retrieve all delivery assignments associated with a shipment"
    )
    @GetMapping("/shipment/{shipmentId}")
    public List<DeliveryAssignment> getAssignmentsByShipment(
            @PathVariable Long shipmentId) {

        return assignmentService.getAssignmentsByShipment(shipmentId);
    }

    @Operation(
            summary = "Update Assignment Status",
            description = "Update the delivery assignment status using the assignment ID"
    )
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String status = request.get("status");

        DeliveryAssignment updated =
                assignmentService.updateStatus(id, status);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }
}