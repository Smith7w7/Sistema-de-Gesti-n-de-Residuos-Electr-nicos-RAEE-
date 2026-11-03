package com.example.demo;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
public class SecurityAndValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("1. Autenticación fallida con credenciales incorrectas (401)")
    public void testLoginFallido() throws Exception {
        String loginJson = """
            {
                "username": "admin",
                "password": "wrongpassword"
            }
        """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Autenticación Fallida"));
    }

    @Test
    @DisplayName("2. Autenticación exitosa y generación de Token JWT (200)")
    public void testLoginExitosoJWT() throws Exception {
        String loginJson = """
            {
                "username": "admin",
                "password": "admin123"
            }
        """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.type").value("Bearer"))
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.rol").value("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("3. Acceso denegado a ruta protegida sin token JWT (403)")
    public void testAccesoSinToken() throws Exception {
        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("4. Validación de campos: Rechazo de producto con nombre vacío (400)")
    public void testValidacionProductoIncompleto() throws Exception {
        // Obtener token
        String token = obtenerToken("admin", "admin123");

        String invalidProductJson = """
            {
                "nombre": "",
                "precio": -10.0,
                "stock": -5
            }
        """;

        mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidProductJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Error de Validación"))
                .andExpect(jsonPath("$.validationErrors.nombre").exists())
                .andExpect(jsonPath("$.validationErrors.precio").exists())
                .andExpect(jsonPath("$.validationErrors.stock").exists());
    }

    @Test
    @DisplayName("5. Control de Acceso por Roles: VENDEDOR no puede eliminar productos (403)")
    public void testRolVendedorNoPuedeEliminar() throws Exception {
        String tokenVendedor = obtenerToken("vendedor", "vendedor123");

        mockMvc.perform(delete("/api/productos/1")
                        .header("Authorization", "Bearer " + tokenVendedor))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Acceso Denegado"));
    }

    private String obtenerToken(String username, String password) throws Exception {
        String json = String.format("{\"username\":\"%s\",\"password\":\"%s\"}", username, password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        return root.get("token").asText();
    }
}
