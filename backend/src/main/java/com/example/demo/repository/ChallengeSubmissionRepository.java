package com.example.demo.repository;

import com.example.demo.entity.ChallengeSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallengeSubmissionRepository extends JpaRepository<ChallengeSubmission, Long> {
    List<ChallengeSubmission> findByContestantId(Long contestantId);
}