package com.courier.service;

import com.courier.entity.Tracking;
import com.courier.repository.TrackingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TrackingService {

    private final TrackingRepository trackingRepository;

    public TrackingService(TrackingRepository trackingRepository) {
        this.trackingRepository = trackingRepository;
    }

    public Tracking addTracking(Tracking tracking) {

        if (tracking.getUpdatedAt() == null) {
            tracking.setUpdatedAt(LocalDateTime.now());
        }

        return trackingRepository.save(tracking);
    }

    public List<Tracking> getTrackingByShipmentId(Long shipmentId) {
        return trackingRepository.findByShipmentId(shipmentId);
    }

    public List<Tracking> getAllTracking() {
        return trackingRepository.findAll();
    }

    public Tracking getTrackingById(Long id) {
        return trackingRepository.findById(id).orElse(null);
    }

    public Tracking updateTracking(Long id, Tracking trackingDetails) {

        Tracking existingTracking = trackingRepository.findById(id).orElse(null);

        if (existingTracking == null) {
            return null;
        }

        existingTracking.setStatus(trackingDetails.getStatus());
        existingTracking.setLocation(trackingDetails.getLocation());
        existingTracking.setDescription(trackingDetails.getDescription());

        if (trackingDetails.getUpdatedAt() != null) {
            existingTracking.setUpdatedAt(trackingDetails.getUpdatedAt());
        }

        if (trackingDetails.getShipment() != null) {
            existingTracking.setShipment(trackingDetails.getShipment());
        }

        return trackingRepository.save(existingTracking);
    }

    public boolean deleteTracking(Long id) {

        if (!trackingRepository.existsById(id)) {
            return false;
        }

        trackingRepository.deleteById(id);
        return true;
    }
}