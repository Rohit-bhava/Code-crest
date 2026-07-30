package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.ProgrammingContest;

public interface ProgrammingContestRepository extends JpaRepository<ProgrammingContest, Long> {}