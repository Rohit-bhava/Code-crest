package com.example.demo.repository;

import com.example.demo.entity.ProgrammingContest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgrammingContestRepository extends JpaRepository<ProgrammingContest, Long> {
}