package com.courier.controller;

import com.courier.entity.DeliveryStaff;
import com.courier.service.DeliveryStaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery-staff")
@SecurityRequirement(name = "bearerAuth")
public class DeliveryStaffController {

    private final DeliveryStaffService deliveryStaffService;

    public DeliveryStaffController(DeliveryStaffService deliveryStaffService) {
        this.deliveryStaffService = deliveryStaffService;
    }

    @Operation(
            summary = "Create Delivery Staff",
            description = "Create a new delivery staff member in the courier management system"
    )
    @PostMapping
    public DeliveryStaff createStaff(@RequestBody DeliveryStaff staff) {
        return deliveryStaffService.createStaff(staff);
    }

    @Operation(
            summary = "Get All Delivery Staff",
            description = "Retrieve all delivery staff members"
    )
    @GetMapping
    public List<DeliveryStaff> getAllStaff() {
        return deliveryStaffService.getAllStaff();
    }

    @Operation(
            summary = "Get Delivery Staff by ID",
            description = "Retrieve delivery staff details using the staff ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryStaff> getStaffById(@PathVariable Long id) {

        return deliveryStaffService.getStaffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Update Delivery Staff",
            description = "Update the details of an existing delivery staff member"
    )
    @PutMapping("/{id}")
    public ResponseEntity<DeliveryStaff> updateStaff(
            @PathVariable Long id,
            @RequestBody DeliveryStaff staff) {

        DeliveryStaff updatedStaff =
                deliveryStaffService.updateStaff(id, staff);

        if (updatedStaff == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedStaff);
    }

    @Operation(
            summary = "Delete Delivery Staff",
            description = "Delete an existing delivery staff member using the staff ID"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStaff(@PathVariable Long id) {

        deliveryStaffService.deleteStaff(id);

        return ResponseEntity.ok("Delivery staff deleted successfully");
    }
}