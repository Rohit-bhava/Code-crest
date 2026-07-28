package com.example.codecrest.repository;

import com.example.codecrest.entity.ContestRanking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContestRankingRepository extends JpaRepository<ContestRanking, Long> {
    Optional<ContestRanking> findByContestIdAndContestantId(Long contestId, Long contestantId);
    Page<ContestRanking> findByContestIdOrderByCurrentScoreDescPenaltyTimeAsc(Long contestId, Pageable pageable);
    List<ContestRanking> findByContestId(Long contestId);
    long countByContestId(Long contestId);
}