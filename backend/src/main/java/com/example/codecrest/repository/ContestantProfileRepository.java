package com.example.codecrest.repository;

import com.example.codecrest.entity.ContestantProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContestantProfileRepository extends JpaRepository<ContestantProfile, Long> {
}