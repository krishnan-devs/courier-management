package com.courier.config;

import com.courier.entity.Staff;
import com.courier.repository.StaffRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            StaffRepository staffRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "krish@gmail.com";

            if (staffRepository.findByEmail(adminEmail).isEmpty()) {

                Staff admin = new Staff();

                admin.setName("Krishnan");
                admin.setEmail(adminEmail);
                admin.setPhone("9999999999");
                admin.setLocation("Chennai");
                admin.setRole("ADMIN");

                admin.setPassword(
                        passwordEncoder.encode("KrishAdmin@123")
                );

                staffRepository.save(admin);

                System.out.println("=================================");
                System.out.println("Production ADMIN created successfully");
                System.out.println("Email: " + adminEmail);
                System.out.println("=================================");

            } else {

                System.out.println("ADMIN already exists. No changes made.");

            }
        };
    }
}