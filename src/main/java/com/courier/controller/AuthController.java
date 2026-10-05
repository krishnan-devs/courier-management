package com.courier.controller;

import com.courier.dto.LoginRequest;
import com.courier.dto.LoginResponse;
import com.courier.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Operation(
            summary = "User Login",
            description = "Authenticate a user using email and password and generate a JWT token"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Login successful"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid email or password"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authenticationService.login(request);
    }
}