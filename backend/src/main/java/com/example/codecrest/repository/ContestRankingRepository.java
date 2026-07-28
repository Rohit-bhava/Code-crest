package com.example.codecrest.repository;

import com.example.codecrest.entity.ContestRanking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContestRankingRepository extends JpaRepository<ContestRanking, Long> {
}