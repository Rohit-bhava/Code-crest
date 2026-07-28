package com.example.codecrest.config;

import com.example.codecrest.*;codecrest.entity.CodingChallenge;
import com.example.codecrest.entity.SystemUser;
import com.example.codecrest.enums.Difficulty;
import com.example.codecrest.enums.UserRole;
import com.example.codecrest.repository.CodingChallengeRepository;
import com.example.codecrest.repository.SystemUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository userRepository;
    private final CodingChallengeRepository challengeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(SystemUserRepository userRepository,
                      CodingChallengeRepository challengeRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.challengeRepository = challengeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        SystemUser admin = userRepository.findByUsername("admin").orElseGet(() -> {
            SystemUser user = new SystemUser("admin", passwordEncoder.encode("admin123"), UserRole.ROLE_PLATFORM_ADMIN);
            return userRepository.save(user);
        });

        SystemUser setter = userRepository.findByUsername("setter").orElseGet(() -> {
            SystemUser user = new SystemUser("setter", passwordEncoder.encode("setter123"), UserRole.ROLE_PROBLEM_SETTER);
            return userRepository.save(user);
        });

        if (challengeRepository.count() < 15) {
            for (int i = 1; i <= 15; i++) {
                CodingChallenge challenge = new CodingChallenge();
                challenge.setTitle("Challenge #" + i);
                challenge.setDescription("Description for challenge statement #" + i);
                challenge.setDifficulty(i % 3 == 0 ? Difficulty.HARD : (i % 2 == 0 ? Difficulty.MEDIUM : Difficulty.EASY));
                challenge.setBasePoints(i * 100);
                challenge.setTimeLimitMs(1000 + i * 100);
                challenge.setSetter(setter);
                challengeRepository.save(challenge);
            }
        }
    }
}