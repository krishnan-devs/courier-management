package com.courier.security;

import com.courier.entity.Customer;
import com.courier.entity.Staff;
import com.courier.repository.CustomerRepository;
import com.courier.repository.StaffRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;

    public CustomUserDetailsService(
            CustomerRepository customerRepository,
            StaffRepository staffRepository) {

        this.customerRepository = customerRepository;
        this.staffRepository = staffRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // Check Staff table first
        Staff staff = staffRepository.findByEmail(email).orElse(null);

        if (staff != null) {

            return User.builder()
                    .username(staff.getEmail())
                    .password(staff.getPassword())
                    .roles(staff.getRole())
                    .build();
        }

        // Check Customer table
        Customer customer = customerRepository.findByEmail(email).orElse(null);

        if (customer != null) {

            return User.builder()
                    .username(customer.getEmail())
                    .password(customer.getPassword())
                    .roles(customer.getRole())
                    .build();
        }

        throw new UsernameNotFoundException(
                "User not found: " + email
        );
    }
}