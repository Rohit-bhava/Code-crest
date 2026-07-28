// File: src/main/java/com/example/codecrest/config/DataSeeder.java
package com.example.codecrest.config;

import com.example.codecrest.entity.CodingChallenge;
import com.example.codecrest.entity.SystemUser;
import com.example.codecrest.enums.Difficulty;
import com.example.codecrest.enums.UserRole;
import com.example.codecrest.repository.CodingChallengeRepository;
import com.example.codecrest.repository.SystemUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private SystemUserRepository userRepository;

    @Autowired
    private CodingChallengeRepository challengeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            SystemUser admin = SystemUser.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(UserRole.ROLE_PLATFORM_ADMIN)
                    .build();
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("setter")) {
            SystemUser setter = SystemUser.builder()
                    .username("setter")
                    .password(passwordEncoder.encode("setter123"))
                    .role(UserRole.ROLE_PROBLEM_SETTER)
                    .build();
            userRepository.save(setter);
        }

        if (challengeRepository.count() < 15) {
            SystemUser setter = userRepository.findByUsername("setter").orElse(null);

            for (int i = 1; i <= 15; i++) {
                CodingChallenge challenge = CodingChallenge.builder()
                        .title("Sample Challenge #" + i)
                        .description("This is the detailed problem statement description for challenge #" + i)
                        .difficulty(i % 3 == 0 ? Difficulty.HARD : (i % 2 == 0 ? Difficulty.MEDIUM : Difficulty.EASY))
                        .basePoints(100 + (i * 10))
                        .timeLimitMs(1000)
                        .setter(setter)
                        .build();
                challengeRepository.save(challenge);
            }
        }
    }
}