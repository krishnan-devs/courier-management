package com.courier.controller;

import com.courier.entity.Delivery;
import com.courier.entity.Staff;
import com.courier.repository.StaffRepository;
import com.courier.service.DeliveryService;
import com.courier.dto.StatusUpdateRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final StaffRepository staffRepository;

    public DeliveryController(
            DeliveryService deliveryService,
            StaffRepository staffRepository) {

        this.deliveryService = deliveryService;
        this.staffRepository = staffRepository;
    }

    // Create Delivery
    @PostMapping
    public Delivery createDelivery(
            @RequestBody Delivery delivery) {

        return deliveryService.createDelivery(delivery);
    }

    // Get All Deliveries
    @GetMapping
    public List<Delivery> getAllDeliveries() {

        return deliveryService.getAllDeliveries();
    }

    // Get Deliveries Assigned To A Staff Member
    @GetMapping("/staff/{staffId}")
    public List<Delivery> getDeliveriesByStaffId(
            @PathVariable Long staffId) {

        return deliveryService.getDeliveriesByStaffId(staffId);
    }

    // Get Deliveries Assigned To Currently Logged-In Staff
    @GetMapping("/staff/me")
    public ResponseEntity<List<Delivery>> getMyDeliveries(
            Authentication authentication) {

        String email = authentication.getName();

        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Staff not found")
                );

        return ResponseEntity.ok(
                deliveryService.getDeliveriesByStaffId(
                        staff.getId()
                )
        );
    }

    // Update Delivery Status
    @PutMapping("/{id}/status")
    public ResponseEntity<Delivery> updateDeliveryStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {

        Delivery updatedDelivery =
                deliveryService.updateDeliveryStatus(
                        id,
                        request.getStatus()
                );

        return ResponseEntity.ok(updatedDelivery);
    }

    // Get Delivery By ID
    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDeliveryById(
            @PathVariable Long id) {

        return deliveryService.getDeliveryById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // Update Delivery
    @PutMapping("/{id}")
    public ResponseEntity<Delivery> updateDelivery(
            @PathVariable Long id,
            @RequestBody Delivery delivery) {

        Delivery updatedDelivery =
                deliveryService.updateDelivery(
                        id,
                        delivery
                );

        if (updatedDelivery == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedDelivery);
    }

    // Delete Delivery
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(
            @PathVariable Long id) {

        deliveryService.deleteDelivery(id);

        return ResponseEntity.noContent().build();
    }


}