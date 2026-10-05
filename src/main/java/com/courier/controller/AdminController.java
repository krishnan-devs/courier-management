package com.courier.controller;

import com.courier.dto.AdminDashboardResponse;
import com.courier.service.AdminDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminDashboardService adminDashboardService;

    public AdminController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @Operation(
            summary = "Admin Dashboard",
            description = "Retrieve dashboard statistics and information for the administrator"
    )
    @GetMapping("/dashboard")
    public AdminDashboardResponse adminDashboard() {

        return adminDashboardService.getDashboardData();
    }
}