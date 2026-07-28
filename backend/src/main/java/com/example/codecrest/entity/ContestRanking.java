package com.example.codecrest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "contest_rankings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"contest_id", "contestant_id"})
})
public class ContestRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "contest_id", nullable = false)
    private ProgrammingContest contest;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "contestant_id", nullable = false)
    private ContestantProfile contestant;

    private Integer currentScore = 0;

    private Integer penaltyTime = 0;

    private Integer localRank = 0;

    public ContestRanking() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProgrammingContest getContest() { return contest; }
    public void setContest(ProgrammingContest contest) { this.contest = contest; }

    public ContestantProfile getContestant() { return contestant; }
    public void setContestant(ContestantProfile contestant) { this.contestant = contestant; }

    public Integer getCurrentScore() { return currentScore; }
    public void setCurrentScore(Integer currentScore) { this.currentScore = currentScore; }

    public Integer getPenaltyTime() { return penaltyTime; }
    public void setPenaltyTime(Integer penaltyTime) { this.penaltyTime = penaltyTime; }

    public Integer getLocalRank() { return localRank; }
    public void setLocalRank(Integer localRank) { this.localRank = localRank; }
}