package com.courier.repository;

import com.courier.entity.DeliveryStaff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryStaffRepository extends JpaRepository<DeliveryStaff, Long> {
}