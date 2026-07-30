package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contest_rankings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ProgrammingContest contest;

    @ManyToOne
    private ContestantProfile contestant;

    private Integer currentScore;

    private Integer penaltyTime;

    private Integer localRank;
}