    package com.courier.repository;

    import com.courier.entity.Shipment;
    import org.springframework.data.jpa.repository.JpaRepository;
    import com.courier.entity.Customer;
    import java.util.List;

    import java.util.Optional;

    public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

        Optional<Shipment> findByTrackingNumber(String trackingNumber);

        List<Shipment> findByCustomer(Customer customer);

        long countByStatus(String status);

        long countByStatusIgnoreCase(String status);


    }