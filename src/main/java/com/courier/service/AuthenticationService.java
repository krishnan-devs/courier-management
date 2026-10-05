package com.courier.service;

import com.courier.dto.LoginRequest;
import com.courier.dto.LoginResponse;
import com.courier.entity.Customer;
import com.courier.entity.Staff;
import com.courier.repository.CustomerRepository;
import com.courier.repository.StaffRepository;
import com.courier.security.JwtService;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final StaffRepository staffRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationService(
            StaffRepository staffRepository,
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.staffRepository = staffRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail();
        String password = request.getPassword();

        // Check Staff table
        Staff staff = staffRepository.findByEmail(email).orElse(null);

        if (staff != null) {

            if (!passwordEncoder.matches(
                    password,
                    staff.getPassword())) {

                throw new BadCredentialsException(
                        "Invalid email or password");
            }

            String token = jwtService.generateToken(staff.getEmail());

            return new LoginResponse(
                    token,
                    "Staff login successful",
                    staff.getRole(),
                    staff.getId()
            );
        }

        // Check Customer table
        Customer customer =
                customerRepository.findByEmail(email).orElse(null);

        if (customer != null) {

            if (!passwordEncoder.matches(
                    password,
                    customer.getPassword())) {

                throw new BadCredentialsException(
                        "Invalid email or password");
            }

            String token =
                    jwtService.generateToken(customer.getEmail());

            return new LoginResponse(
                    token,
                    "Customer login successful",
                    customer.getRole(),
                    customer.getId()
            );
        }

        throw new BadCredentialsException(
                "Invalid email or password");
    }
}