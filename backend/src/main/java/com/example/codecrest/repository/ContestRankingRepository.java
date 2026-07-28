package com.example.codecrest.repository;

import com.codecrest.entity.ContestRanking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContestRankingRepository extends JpaRepository<ContestRanking, Long> {
    Optional<ContestRanking> findByContestIdAndContestantId(Long contestId, Long contestantId);
    boolean existsByContestIdAndContestantId(Long contestId, Long contestantId);
    long countByContestId(Long contestId);
    Page<ContestRanking> findByContestIdOrderByCurrentScoreDescPenaltyTimeAsc(Long contestId, Pageable pageable);
}