package com.example.codecrest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "contest_rankings")
public class ContestRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contest_id")
    private ProgrammingContest contest;

    private Integer score;
    private Integer rank;

    public ContestRanking() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProgrammingContest getContest() { return contest; }
    public void setContest(ProgrammingContest contest) { this.contest = contest; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }
}