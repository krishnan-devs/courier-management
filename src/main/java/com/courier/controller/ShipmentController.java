package com.courier.controller;

import com.courier.entity.Shipment;
import com.courier.service.ShipmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import com.courier.response.ApiResponse;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/shipments")
@SecurityRequirement(name = "bearerAuth")
public class ShipmentController {

    private final ShipmentService shipmentService;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    // Create shipment
    @Operation(
            summary = "Create Shipment",
            description = "Create a new shipment in the courier management system"
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "Shipment created successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid shipment data"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized"
            )
    })
    @PostMapping
    public ResponseEntity<ApiResponse<Shipment>> createShipment(
            @Valid @RequestBody Shipment shipment,
            Authentication authentication) {

        Shipment createdShipment;

        String role = authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        if ("ROLE_CUSTOMER".equals(role)) {

            String email = authentication.getName();

            createdShipment =
                    shipmentService.createCustomerShipment(
                            shipment,
                            email
                    );

        } else {

            createdShipment =
                    shipmentService.createShipment(shipment);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                true,
                                "Shipment created successfully",
                                createdShipment
                        )
                );
    }

    // Get all shipments
    @Operation(
            summary = "Get All Shipments",
            description = "Retrieve all shipments from the courier management system"
    )

    //Get all shipments
    @GetMapping
    public ResponseEntity<ApiResponse<List<Shipment>>> getAllShipments() {

        List<Shipment> shipments = shipmentService.getAllShipments();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Shipments fetched successfully",
                        shipments
                )
        );
    }

    // Get shipments with pagination and sorting
    @Operation(
            summary = "Get Shipments with Pagination and Sorting",
            description = """
                Retrieve shipments using pagination and sorting.

                Parameters:
                - page: Page number starting from 0
                - size: Number of shipments per page
                - sortBy: Field used for sorting
                - direction: asc or desc
                """
    )
    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<Shipment>>> getShipmentsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Shipment> shipments =
                shipmentService.getShipments(pageable);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Shipments fetched successfully",
                        shipments
                )
        );
    }

    // Get shipment by ID
    @Operation(
            summary = "Get Shipment by ID",
            description = "Retrieve shipment details using the shipment ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Shipment>> getShipmentById(
            @PathVariable Long id) {

        Optional<Shipment> shipment = shipmentService.getShipmentById(id);

        if (shipment.isPresent()) {
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Shipment fetched successfully",
                            shipment.get()
                    )
            );
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(
                        false,
                        "Shipment not found",
                        null
                ));
    }

    // Get shipment by tracking number
    @Operation(
            summary = "Get Shipment by Tracking Number",
            description = "Retrieve shipment details using the tracking number"
    )
    @GetMapping("/tracking/{trackingNumber}")
    public ResponseEntity<ApiResponse<Shipment>> getByTrackingNumber(
            @PathVariable String trackingNumber) {

        Optional<Shipment> shipment =
                shipmentService.getShipmentByTrackingNumber(trackingNumber);

        if (shipment.isPresent()) {
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Shipment fetched successfully",
                            shipment.get()
                    )
            );
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(
                        new ApiResponse<>(
                                false,
                                "Shipment not found",
                                null
                        )
                );
    }

    // Update shipment
    @Operation(
            summary = "Update Shipment",
            description = "Update the details of an existing shipment using its ID"
    )
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Shipment>> updateShipment(
            @PathVariable Long id,
            @Valid @RequestBody Shipment shipment) {

        Shipment updatedShipment =
                shipmentService.updateShipment(id, shipment);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Shipment updated successfully",
                        updatedShipment
                )
        );
    }

    // Delete shipment
    @Operation(
            summary = "Delete Shipment",
            description = "Delete an existing shipment using its ID"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteShipment(
            @PathVariable Long id) {

        shipmentService.deleteShipment(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Shipment deleted successfully",
                        null
                )
        );
    }
}