package com.example.demo.repository;

import com.example.demo.entity.ContestantProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContestantProfileRepository extends JpaRepository<ContestantProfile, Long> {
    Optional<ContestantProfile> findByUsername(String username);

    Page<ContestantProfile> findAllByOrderByTotalPointsDesc(Pageable pageable);
}