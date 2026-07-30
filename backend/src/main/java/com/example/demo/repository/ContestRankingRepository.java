package com.example.demo.repository;

import com.example.demo.entity.ContestRanking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContestRankingRepository extends JpaRepository<ContestRanking, Long> {
    Page<ContestRanking> findByContestIdOrderByCurrentScoreDescPenaltyTimeAsc(Long contestId, Pageable pageable);

    Optional<ContestRanking> findByContestIdAndContestantId(Long contestId, Long contestantId);
}