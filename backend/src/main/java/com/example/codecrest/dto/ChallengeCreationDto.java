package com.example.codecrest.dto;

import com.example.codecrest.enums.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChallengeCreationDto {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotNull
    private Difficulty difficulty;
    @NotNull
    private Integer basePoints;
    @NotNull
    private Integer timeLimitMs;
}