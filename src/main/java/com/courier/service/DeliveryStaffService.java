package com.courier.service;

import com.courier.entity.DeliveryStaff;
import com.courier.repository.DeliveryStaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryStaffService {

    private final DeliveryStaffRepository deliveryStaffRepository;

    public DeliveryStaffService(DeliveryStaffRepository deliveryStaffRepository) {
        this.deliveryStaffRepository = deliveryStaffRepository;
    }

    public DeliveryStaff createStaff(DeliveryStaff staff) {
        return deliveryStaffRepository.save(staff);
    }

    public List<DeliveryStaff> getAllStaff() {
        return deliveryStaffRepository.findAll();
    }

    public Optional<DeliveryStaff> getStaffById(Long id) {
        return deliveryStaffRepository.findById(id);
    }

    public DeliveryStaff updateStaff(Long id, DeliveryStaff staff) {

        Optional<DeliveryStaff> existingStaff =
                deliveryStaffRepository.findById(id);

        if (existingStaff.isPresent()) {

            DeliveryStaff existing = existingStaff.get();

            existing.setName(staff.getName());
            existing.setPhone(staff.getPhone());
            existing.setEmail(staff.getEmail());
            existing.setLocation(staff.getLocation());
            existing.setStatus(staff.getStatus());

            return deliveryStaffRepository.save(existing);
        }

        return null;
    }

    public void deleteStaff(Long id) {
        deliveryStaffRepository.deleteById(id);
    }
}