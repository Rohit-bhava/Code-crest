// File: src/main/java/com/example/codecrest/repository/SystemUserRepository.java
package com.example.codecrest.repository;

import com.example.codecrest.entity.SystemUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SystemUserRepository extends JpaRepository<SystemUser, Long> {
    Optional<SystemUser> findByUsername(String username);
    boolean existsByUsername(String username);
}