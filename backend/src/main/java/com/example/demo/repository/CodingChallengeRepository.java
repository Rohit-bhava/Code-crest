package com.example.demo.repository;

import com.example.demo.entity.CodingChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodingChallengeRepository extends JpaRepository<CodingChallenge, Long> {
}