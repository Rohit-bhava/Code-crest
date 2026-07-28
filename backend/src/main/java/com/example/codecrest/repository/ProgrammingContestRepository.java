package com.example.codecrest.repository;

import com.example.codecrest.entity.ProgrammingContest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgrammingContestRepository extends JpaRepository<ProgrammingContest, Long> {
}