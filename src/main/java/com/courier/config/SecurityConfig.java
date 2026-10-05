package com.courier.config;

import com.courier.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.courier.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                )

                .authorizeHttpRequests(auth -> auth

                        // Allow CORS preflight requests
                        .requestMatchers(
                                org.springframework.http.HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()

                        // ===============================
                        // Public APIs
                        // ===============================

                        // Health check
                        .requestMatchers("/health")
                        .permitAll()

                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        .requestMatchers("/api/customer/register")
                        .permitAll()

                        // Swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        )
                        .permitAll()

                        // ===============================
                        // Admin APIs
                        // ===============================

                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                        // ===============================
                        // Staff APIs
                        // ===============================

                        // Admin staff management
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/api/staff"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/api/staff/{id}"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST,
                                "/api/staff"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                org.springframework.http.HttpMethod.PUT,
                                "/api/staff/{id}"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                org.springframework.http.HttpMethod.DELETE,
                                "/api/staff/{id}"
                        )
                        .hasRole("ADMIN")

                        // Staff dashboard
                        .requestMatchers("/api/staff/dashboard")
                        .hasRole("STAFF")

                        // ===============================
                        // Customer APIs
                        // ===============================

                        .requestMatchers("/api/customer/**")
                        .hasRole("CUSTOMER")

                        // ===============================
                        // Delivery Staff Management
                        // ===============================

                        .requestMatchers("/api/delivery-staff")
                        .hasRole("ADMIN")

                        .requestMatchers("/api/delivery-staff/**")
                        .hasAnyRole("ADMIN", "STAFF")

                        // ===============================
                        // Shipment APIs
                        // ===============================

                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST,
                                "/api/shipments"
                        )
                        .hasAnyRole("ADMIN", "STAFF", "CUSTOMER")

                        .requestMatchers("/api/shipments/**")
                        .hasAnyRole("ADMIN", "STAFF")

                        // ===============================
                        // Assignment APIs
                        // ===============================

                        .requestMatchers("/api/assignments/assign")
                        .hasRole("ADMIN")

                        .requestMatchers("/api/assignments/*/status")
                        .hasRole("STAFF")

                        .requestMatchers("/api/assignments/**")
                        .hasAnyRole("ADMIN", "STAFF")

                        // ===============================
                        // Delivery APIs
                        // ===============================

                        .requestMatchers("/api/deliveries/**")
                        .hasAnyRole("ADMIN", "STAFF")

                        // ===============================
                        // Notification APIs
                        // ===============================

                        .requestMatchers("/api/notifications/**")
                        .hasAnyRole("ADMIN", "STAFF", "CUSTOMER")

                        // ===============================
                        // Tracking APIs
                        // ===============================

                        .requestMatchers("/api/tracking/**")
                        .permitAll()

                        // ===============================
                        // Everything else
                        // ===============================

                        .anyRequest()
                        .authenticated()
                )

                .exceptionHandling(exception -> exception

                        .authenticationEntryPoint((request, response, authException) -> {

                            response.setStatus(401);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                            ApiResponse<Void> apiResponse =
                                    new ApiResponse<>(
                                            false,
                                            "Authentication required",
                                            null
                                    );

                            response.getWriter().write(
                                    new ObjectMapper().writeValueAsString(apiResponse)
                            );
                        })

                        .accessDeniedHandler((request, response, accessDeniedException) -> {

                            response.setStatus(403);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                            ApiResponse<Void> apiResponse =
                                    new ApiResponse<>(
                                            false,
                                            "Access denied",
                                            null
                                    );

                            response.getWriter().write(
                                    new ObjectMapper().writeValueAsString(apiResponse)
                            );
                        })
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:5173"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}