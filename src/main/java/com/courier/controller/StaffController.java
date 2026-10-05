package com.courier.controller;

import com.courier.entity.Staff;
import com.courier.service.StaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@SecurityRequirement(name = "bearerAuth")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    // Create Staff
    @Operation(
            summary = "Create Staff",
            description = "Create a new staff member in the courier management system"
    )
    @PostMapping
    public Staff createStaff(@RequestBody Staff staff) {
        return staffService.createStaff(staff);
    }

    // Get All Staff
    @Operation(
            summary = "Get All Staff",
            description = "Get all staff members"
    )
    @GetMapping
    public List<Staff> getAllStaff() {
        return staffService.getAllStaff();
    }

    // Get Staff By ID
    @Operation(
            summary = "Get Staff By ID",
            description = "Get a staff member by ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {

        return staffService.getStaffById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update Staff
    @Operation(
            summary = "Update Staff",
            description = "Update an existing staff member"
    )
    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(
            @PathVariable Long id,
            @RequestBody Staff staff
    ) {

        Staff updatedStaff =
                staffService.updateStaff(id, staff);

        if (updatedStaff == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedStaff);
    }

    // Delete Staff
    @Operation(
            summary = "Delete Staff",
            description = "Delete a staff member if they have no delivery assignments"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStaff(
            @PathVariable Long id
    ) {

        String result = staffService.deleteStaff(id);

        if (result.equals("NOT_FOUND")) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (result.equals("HAS_DELIVERIES")) {
            return ResponseEntity
                    .status(409)
                    .body("Staff cannot be deleted because they have existing delivery assignments.");
        }

        return ResponseEntity.ok("Staff deleted successfully");
    }

    // Staff Dashboard
    @Operation(
            summary = "Staff Dashboard",
            description = "Access the staff dashboard. Requires STAFF authorization."
    )
    @GetMapping("/dashboard")
    public String staffDashboard() {
        return "Welcome Staff! You have STAFF access.";
    }
}