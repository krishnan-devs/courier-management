package com.courier.exception;

import com.courier.response.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler =
            new GlobalExceptionHandler();


    // =========================================================
    // 1. Shipment Not Found
    // =========================================================

    @Test
    void testShipmentNotFoundException() {

        ShipmentNotFoundException exception =
                new ShipmentNotFoundException("Shipment not found");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleShipmentNotFound(exception);

        assertEquals(404, response.getStatusCode().value());

        assertNotNull(response.getBody());

        assertFalse(response.getBody().isSuccess());

        assertEquals(
                "Shipment not found",
                response.getBody().getMessage()
        );

        assertNull(response.getBody().getData());
    }


    // =========================================================
    // 2. Delivery Not Found
    // =========================================================

    @Test
    void testDeliveryNotFoundException() {

        DeliveryNotFoundException exception =
                new DeliveryNotFoundException("Delivery not found");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleDeliveryNotFound(exception);

        assertEquals(404, response.getStatusCode().value());

        assertNotNull(response.getBody());

        assertFalse(response.getBody().isSuccess());

        assertEquals(
                "Delivery not found",
                response.getBody().getMessage()
        );

        assertNull(response.getBody().getData());
    }


    // =========================================================
    // 3. User Not Found
    // =========================================================

    @Test
    void testUserNotFoundException() {

        UserNotFoundException exception =
                new UserNotFoundException("User not found");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleUserNotFound(exception);

        assertEquals(404, response.getStatusCode().value());

        assertNotNull(response.getBody());

        assertFalse(response.getBody().isSuccess());

        assertEquals(
                "User not found",
                response.getBody().getMessage()
        );

        assertNull(response.getBody().getData());
    }


    // =========================================================
    // 4. Bad Credentials
    // =========================================================

    @Test
    void testBadCredentialsException() {

        BadCredentialsException exception =
                new BadCredentialsException(
                        "Invalid email or password"
                );

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleBadCredentials(exception);

        assertEquals(401, response.getStatusCode().value());

        assertNotNull(response.getBody());

        assertFalse(response.getBody().isSuccess());

        assertEquals(
                "Invalid email or password",
                response.getBody().getMessage()
        );

        assertNull(response.getBody().getData());
    }


    // =========================================================
    // 5. General Exception
    // =========================================================

    @Test
    void testGeneralException() {

        Exception exception =
                new Exception("Something went wrong");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleGeneralException(exception);

        assertEquals(500, response.getStatusCode().value());

        assertNotNull(response.getBody());

        assertFalse(response.getBody().isSuccess());

        assertEquals(
                "An unexpected error occurred",
                response.getBody().getMessage()
        );

        assertNull(response.getBody().getData());
    }


    // =========================================================
    // 6. Data should be null for error responses
    // =========================================================

    @Test
    void testExceptionResponseDataIsNull() {

        ShipmentNotFoundException exception =
                new ShipmentNotFoundException("Shipment not found");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleShipmentNotFound(exception);

        assertNotNull(response.getBody());

        assertNull(response.getBody().getData());
    }
}