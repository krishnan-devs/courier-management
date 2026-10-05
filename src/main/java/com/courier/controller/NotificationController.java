package com.courier.controller;

import com.courier.entity.Notification;
import com.courier.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Create notification
    @Operation(
            summary = "Create Notification",
            description = "Create a new notification for a user"
    )
    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam String message) {

        Notification notification =
                notificationService.createNotification(
                        userId, title, message);

        return ResponseEntity.ok(notification);
    }

    // Get all notifications for a user
    @Operation(
            summary = "Get User Notifications",
            description = "Retrieve all notifications associated with a specific user"
    )
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getUserNotifications(userId));
    }

    // Get unread notifications
    @Operation(
            summary = "Get Unread Notifications",
            description = "Retrieve all unread notifications for a specific user"
    )
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(userId));
    }

    // Mark notification as read
    @Operation(
            summary = "Mark Notification as Read",
            description = "Mark a specific notification as read using its notification ID"
    )
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                notificationService.markAsRead(id));
    }
}