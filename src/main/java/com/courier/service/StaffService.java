package com.courier.service;

import com.courier.entity.Staff;
import com.courier.repository.DeliveryRepository;
import com.courier.repository.StaffRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final DeliveryRepository deliveryRepository;

    public StaffService(
            StaffRepository staffRepository,
            PasswordEncoder passwordEncoder,
            DeliveryRepository deliveryRepository) {

        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
        this.deliveryRepository = deliveryRepository;
    }

    // Create Staff
    public Staff createStaff(Staff staff) {

        staff.setPassword(
                passwordEncoder.encode(staff.getPassword())
        );

        return staffRepository.save(staff);
    }

    // Get all staff
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    // Get staff by ID
    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }

    // Update staff
    public Staff updateStaff(Long id, Staff updatedStaff) {

        Optional<Staff> existingStaffOptional =
                staffRepository.findById(id);

        if (existingStaffOptional.isEmpty()) {
            return null;
        }

        Staff existingStaff = existingStaffOptional.get();

        existingStaff.setName(updatedStaff.getName());
        existingStaff.setEmail(updatedStaff.getEmail());
        existingStaff.setPhone(updatedStaff.getPhone());
        existingStaff.setLocation(updatedStaff.getLocation());
        existingStaff.setRole(updatedStaff.getRole());

        if (updatedStaff.getPassword() != null
                && !updatedStaff.getPassword().isBlank()) {

            existingStaff.setPassword(
                    passwordEncoder.encode(updatedStaff.getPassword())
            );
        }

        return staffRepository.save(existingStaff);
    }

    // Delete staff safely
    public String deleteStaff(Long id) {

        // Check whether staff exists
        if (!staffRepository.existsById(id)) {
            return "NOT_FOUND";
        }

        // Check whether staff is assigned to any delivery
        if (!deliveryRepository.findByStaffId(id).isEmpty()) {
            return "HAS_DELIVERIES";
        }

        // Safe to delete
        staffRepository.deleteById(id);

        return "DELETED";
    }
}