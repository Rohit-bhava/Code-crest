package com.codecrest.repository;

import com.codecrest.entity.ContestantProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContestantProfileRepository extends JpaRepository<ContestantProfile, Long> {
    Optional<ContestantProfile> findByUsername(String username);
    Optional<ContestantProfile> findByUserId(Long userId);
    Page<ContestantProfile> findAllByOrderByTotalPointsDesc(Pageable pageable);
}