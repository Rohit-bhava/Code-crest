package com.example.codecrest.repository;

import com.example.codecrest.entity.ProgrammingContest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgrammingContestRepository extends JpaRepository<ProgrammingContest, Long> {}