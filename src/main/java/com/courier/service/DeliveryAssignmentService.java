package com.courier.service;

import com.courier.entity.DeliveryAssignment;
import com.courier.entity.DeliveryStaff;
import com.courier.entity.Shipment;
import com.courier.repository.DeliveryAssignmentRepository;
import com.courier.repository.DeliveryStaffRepository;
import com.courier.repository.ShipmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryAssignmentService {

    private final DeliveryAssignmentRepository assignmentRepository;
    private final DeliveryStaffRepository deliveryStaffRepository;
    private final ShipmentRepository shipmentRepository;

    public DeliveryAssignmentService(
            DeliveryAssignmentRepository assignmentRepository,
            DeliveryStaffRepository deliveryStaffRepository,
            ShipmentRepository shipmentRepository) {

        this.assignmentRepository = assignmentRepository;
        this.deliveryStaffRepository = deliveryStaffRepository;
        this.shipmentRepository = shipmentRepository;
    }

    public DeliveryAssignment assignShipment(
            Long shipmentId,
            Long deliveryStaffId) {

        Optional<Shipment> shipment =
                shipmentRepository.findById(shipmentId);

        Optional<DeliveryStaff> staff =
                deliveryStaffRepository.findById(deliveryStaffId);

        if (shipment.isEmpty() || staff.isEmpty()) {
            return null;
        }

        DeliveryAssignment assignment = new DeliveryAssignment();

        assignment.setShipment(shipment.get());
        assignment.setDeliveryStaff(staff.get());
        assignment.setAssignmentStatus("ASSIGNED");

        staff.get().setStatus("BUSY");
        deliveryStaffRepository.save(staff.get());

        return assignmentRepository.save(assignment);
    }

    public List<DeliveryAssignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<DeliveryAssignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }

    public List<DeliveryAssignment> getAssignmentsByStaff(Long staffId) {
        return assignmentRepository.findByDeliveryStaffId(staffId);
    }

    public List<DeliveryAssignment> getAssignmentsByShipment(Long shipmentId) {
        return assignmentRepository.findByShipmentId(shipmentId);
    }

    public DeliveryAssignment updateStatus(
            Long id,
            String status) {

        Optional<DeliveryAssignment> assignment =
                assignmentRepository.findById(id);

        if (assignment.isEmpty()) {
            return null;
        }

        DeliveryAssignment existing = assignment.get();

        existing.setAssignmentStatus(status);

        // When delivery is completed,
        // make the delivery staff available again
        if ("DELIVERED".equalsIgnoreCase(status)) {

            DeliveryStaff staff = existing.getDeliveryStaff();

            if (staff != null) {
                staff.setStatus("AVAILABLE");
                deliveryStaffRepository.save(staff);
            }
        }

        return assignmentRepository.save(existing);
    }
}