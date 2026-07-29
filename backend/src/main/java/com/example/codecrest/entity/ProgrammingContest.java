package com.example.codecrest.entity;

import java.time.LocalDateTime;

import com.example.codecrest.enums.ContestStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "programming_contests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammingContest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer capacity;

    @Enumerated(EnumType.STRING)
    private ContestStatus status;
}