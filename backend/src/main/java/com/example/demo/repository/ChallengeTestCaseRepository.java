package com.example.demo.repository;

import com.example.demo.entity.ChallengeTestCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallengeTestCaseRepository extends JpaRepository<ChallengeTestCase, Long> {
    List<ChallengeTestCase> findByChallengeIdOrderByTestCaseOrderAsc(Long challengeId);
    List<ChallengeTestCase> findByChallengeIdAndHiddenFalseOrderByTestCaseOrderAsc(Long challengeId);
}
