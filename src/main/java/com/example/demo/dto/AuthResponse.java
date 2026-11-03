package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String rol;

    public AuthResponse(String token, String username, String rol) {
        this.token = token;
        this.type = "Bearer";
        this.username = username;
        this.rol = rol;
    }
}

