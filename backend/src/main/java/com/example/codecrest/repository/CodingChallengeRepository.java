package com.example.codecrest.repository;

import com.example.codecrest.entity.CodingChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodingChallengeRepository extends JpaRepository<CodingChallenge, Long> {}