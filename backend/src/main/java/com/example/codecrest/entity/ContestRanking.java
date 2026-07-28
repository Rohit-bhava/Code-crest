package com.example.codecrest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contest_rankings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"contest_id", "contestant_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", nullable = false)
    private ProgrammingContest contest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contestant_id", nullable = false)
    private ContestantProfile contestant;

    @Builder.Default
    private Integer currentScore = 0;

    @Builder.Default
    private Integer penaltyTime = 0;

    private Integer localRank;
}