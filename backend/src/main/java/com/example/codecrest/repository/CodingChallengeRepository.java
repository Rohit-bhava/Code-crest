package com.example.codecrest.repository;

import com.example.codecrest.entity.ChallengeSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodingChallengeRepository extends JpaRepository<ChallengeSubmission, Long> {
}