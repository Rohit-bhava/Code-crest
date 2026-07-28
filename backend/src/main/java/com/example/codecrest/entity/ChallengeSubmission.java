package com.example.codecrest.entity;

import com.example.codecrest.enums.Verdict;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    @Column(columnDefinition = "TEXT", nullable = false)
    private String sourceCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Verdict verdict;

    private Integer executionTimeMs;

    private Integer pointsEarned;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contestant_id", nullable = false)
    private ContestantProfile contestant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private CodingChallenge challenge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id")
    private ProgrammingContest contest;

    @Column(nullable = false)
    private LocalDateTime submittedAt;
}