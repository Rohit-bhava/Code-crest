package com.example.demo.entity;

import java.time.LocalDateTime;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "challenge_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String sourceCode;

    @Enumerated(EnumType.STRING)
    private Verdict verdict;

    private Integer executionTimeMs;

    private Integer pointsEarned;

    private LocalDateTime submittedAt;

    @ManyToOne
    private ContestantProfile contestant;

    @ManyToOne
    private CodingChallenge challenge;

    @ManyToOne
    private ProgrammingContest contest;
}