package com.courier.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @Operation(
            summary = "Application Home",
            description = "Check whether the AI-Powered Courier Management System is running"
    )
    @GetMapping("/")
    public String home() {
        return "AI-Powered Courier Management System is Running!";
    }

    @Operation(
            summary = "Health Check",
            description = "Check whether the Courier Management System is healthy and available"
    )
    @GetMapping("/health")
    public String health() {
        return "Courier Management System is Healthy!";
    }
}