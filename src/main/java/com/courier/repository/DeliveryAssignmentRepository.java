package com.courier.repository;

import com.courier.entity.DeliveryAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryAssignmentRepository
        extends JpaRepository<DeliveryAssignment, Long> {

    List<DeliveryAssignment> findByDeliveryStaffId(Long deliveryStaffId);

    List<DeliveryAssignment> findByShipmentId(Long shipmentId);
}