package com.example.codecrest.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterDto {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    private String bio;
}