package com.courier.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityAuthenticationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    // =========================================================
    // TEST 1
    // Protected API without JWT
    // =========================================================

    @Test
    void protectedApiWithoutTokenShouldReturn401() throws Exception {

        mockMvc.perform(
                        get("/api/admin/dashboard")
                )
                .andExpect(status().isUnauthorized());
    }

    // =========================================================
    // TEST 2
    // Protected API with invalid JWT
    // =========================================================

    @Test
    void protectedApiWithInvalidTokenShouldReturn401() throws Exception {

        when(jwtService.isTokenValid("invalid-token"))
                .thenReturn(false);

        mockMvc.perform(
                        get("/api/admin/dashboard")
                                .header(
                                        "Authorization",
                                        "Bearer invalid-token"
                                )
                )
                .andExpect(status().isUnauthorized());
    }

    // =========================================================
    // TEST 3
    // ADMIN with valid JWT
    // =========================================================

    @Test
    void adminWithValidTokenShouldAccessAdminApi() throws Exception {

        UserDetails admin = User
                .withUsername("admin@gmail.com")
                .password("password")
                .roles("ADMIN")
                .build();

        when(jwtService.isTokenValid("admin-token"))
                .thenReturn(true);

        when(jwtService.extractEmail("admin-token"))
                .thenReturn("admin@gmail.com");

        when(userDetailsService.loadUserByUsername(
                "admin@gmail.com"))
                .thenReturn(admin);

        mockMvc.perform(
                        get("/api/admin/dashboard")
                                .header(
                                        "Authorization",
                                        "Bearer admin-token"
                                )
                )
                .andExpect(status().isOk());
    }

    // =========================================================
    // TEST 4
    // STAFF cannot access ADMIN API
    // =========================================================

    @Test
    void staffShouldNotAccessAdminApi() throws Exception {

        UserDetails staff = User
                .withUsername("staff1@gmail.com")
                .password("password")
                .roles("STAFF")
                .build();

        when(jwtService.isTokenValid("staff-token"))
                .thenReturn(true);

        when(jwtService.extractEmail("staff-token"))
                .thenReturn("staff1@gmail.com");

        when(userDetailsService.loadUserByUsername(
                "staff1@gmail.com"))
                .thenReturn(staff);

        mockMvc.perform(
                        get("/api/admin/dashboard")
                                .header(
                                        "Authorization",
                                        "Bearer staff-token"
                                )
                )
                .andExpect(status().isForbidden());
    }

    // =========================================================
    // TEST 5
    // CUSTOMER cannot access STAFF API
    // =========================================================

    @Test
    void customerShouldNotAccessStaffApi() throws Exception {

        UserDetails customer = User
                .withUsername("customer@gmail.com")
                .password("password")
                .roles("CUSTOMER")
                .build();

        when(jwtService.isTokenValid("customer-token"))
                .thenReturn(true);

        when(jwtService.extractEmail("customer-token"))
                .thenReturn("customer@gmail.com");

        when(userDetailsService.loadUserByUsername(
                "customer@gmail.com"))
                .thenReturn(customer);

        mockMvc.perform(
                        get("/api/staff/dashboard")
                                .header(
                                        "Authorization",
                                        "Bearer customer-token"
                                )
                )
                .andExpect(status().isForbidden());
    }

    // =========================================================
    // TEST 6
    // Authentication API is PUBLIC
    // =========================================================

    @Test
    void authApiShouldBeAccessibleWithoutToken()
            throws Exception {

        int status = mockMvc.perform(
                        get("/api/auth/login")
                )
                .andReturn()
                .getResponse()
                .getStatus();

        assertNotEquals(401, status);
    }

    // =========================================================
    // TEST 7
    // Customer Registration API is PUBLIC
    // =========================================================

    @Test
    void customerRegistrationShouldBeAccessibleWithoutToken()
            throws Exception {

        int status = mockMvc.perform(
                        get("/api/customer/register")
                )
                .andReturn()
                .getResponse()
                .getStatus();

        assertNotEquals(401, status);
    }
}