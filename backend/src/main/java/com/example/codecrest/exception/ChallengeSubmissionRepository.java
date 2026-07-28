package com.example.codecrest.exception;

import com.codecrest.entity.ChallengeSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallengeSubmissionRepository extends JpaRepository<ChallengeSubmission, Long> {
    List<ChallengeSubmission> findByContestantId(Long contestantId);
    Page<ChallengeSubmission> findByContestantUsername(String username, Pageable pageable);
}