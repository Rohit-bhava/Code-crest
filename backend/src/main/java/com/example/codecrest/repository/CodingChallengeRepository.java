package com.codecrest.repository;

import com.codecrest.entity.CodingChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodingChallengeRepository extends JpaRepository<CodingChallenge, Long> {
}