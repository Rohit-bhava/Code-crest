package com.example.codecrest.repository;

import com.example.codecrest.entity.ChallengeSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallengeSubmissionRepository extends JpaRepository<ChallengeSubmission, Long> {
    Page<ChallengeSubmission> findByContestantId(Long contestantId, Pageable pageable);
    List<ChallengeSubmission> findByContestantId(Long contestantId);
}