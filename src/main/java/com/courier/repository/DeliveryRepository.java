package com.courier.repository;

import com.courier.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    Optional<Delivery> findByShipmentId(Long shipmentId);

    List<Delivery> findByStaffId(Long staffId);
}