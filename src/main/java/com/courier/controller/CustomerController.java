package com.courier.controller;

import com.courier.entity.Customer;
import com.courier.repository.CustomerRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.courier.entity.Shipment;
import com.courier.service.ShipmentService;
import com.courier.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final ShipmentService shipmentService;

    public CustomerController(
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder,
            ShipmentService shipmentService) {

        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.shipmentService = shipmentService;
    }
    @Operation(
            summary = "Register Customer",
            description = "Register a new customer account and securely encrypt the customer's password"
    )
    @PostMapping("/register")
    public Customer registerCustomer(@RequestBody Customer customer) {

        customer.setPassword(
                passwordEncoder.encode(customer.getPassword())
        );

        customer.setRole("CUSTOMER");

        return customerRepository.save(customer);
    }

    @Operation(
            summary = "Customer Dashboard",
            description = "Access the customer dashboard. Requires CUSTOMER authorization."
    )
    @GetMapping("/dashboard")
    public String customerDashboard() {
        return "Welcome Customer! You have CUSTOMER access.";
    }

    @Operation(
            summary = "Get Customer Shipment History",
            description = "Retrieve all shipments booked by the currently logged-in customer"
    )
    @GetMapping("/shipments")
    public ResponseEntity<ApiResponse<List<Shipment>>> getCustomerShipments(
            Authentication authentication) {

        String email = authentication.getName();

        List<Shipment> shipments =
                shipmentService.getCustomerShipments(email);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Customer shipments fetched successfully",
                        shipments
                )
        );
    }
}