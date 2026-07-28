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
            SystemUser admin = new SystemUser();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ROLE_PLATFORM_ADMIN);
            
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("setter")) {
            SystemUser setter = new SystemUser();
            setter.setUsername("setter");
            setter.setPassword(passwordEncoder.encode("setter123"));
            setter.setRole(UserRole.ROLE_PROBLEM_SETTER);
            
            userRepository.save(setter);
        }

        if (challengeRepository.count() < 15) {
            SystemUser setter = userRepository.findByUsername("setter").orElse(null);

            for (int i = 1; i <= 15; i++) {
                CodingChallenge challenge = new CodingChallenge();
                challenge.setTitle("Sample Challenge #" + i);
                challenge.setDescription("This is the detailed problem statement description for challenge #" + i);
                challenge.setDifficulty(i % 3 == 0 ? Difficulty.HARD : (i % 2 == 0 ? Difficulty.MEDIUM : Difficulty.EASY));
                challenge.setBasePoints(100 + (i * 10));
                challenge.setTimeLimitMs(1000);
                challenge.setSetter(setter);

                challengeRepository.save(challenge);
            }
        }
    }
}