package com.example.demo.config;

import com.example.demo.entity.*;
import com.example.demo.repository.CodingChallengeRepository;
import com.example.demo.repository.ContestantProfileRepository;
import com.example.demo.repository.ProgrammingContestRepository;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository systemUserRepository;
    private final ContestantProfileRepository contestantProfileRepository;
    private final CodingChallengeRepository challengeRepository;
    private final ProgrammingContestRepository contestRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(SystemUserRepository systemUserRepository,
                       ContestantProfileRepository contestantProfileRepository,
                       CodingChallengeRepository challengeRepository,
                       ProgrammingContestRepository contestRepository,
                       PasswordEncoder passwordEncoder) {
        this.systemUserRepository = systemUserRepository;
        this.contestantProfileRepository = contestantProfileRepository;
        this.challengeRepository = challengeRepository;
        this.contestRepository = contestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        systemUserRepository.findByUsername("admin").orElseGet(() -> {
            SystemUser u = new SystemUser("admin", passwordEncoder.encode("admin123"), UserRole.PLATFORM_ADMIN);
            return systemUserRepository.save(u);
        });

        SystemUser setter = systemUserRepository.findByUsername("setter").orElseGet(() -> {
            SystemUser u = new SystemUser("setter", passwordEncoder.encode("setter123"), UserRole.PROBLEM_SETTER);
            return systemUserRepository.save(u);
        });

        if (challengeRepository.count() < 15) {
            String[] titles = {"Two Sum", "Binary Search", "Longest Substring", "Merge Intervals", "Knapsack",
                    "Graph BFS", "Dijkstra Shortest Path", "Trie Implementation", "Segment Tree", "LCA in Tree",
                    "Sliding Window Max", "Union Find", "Topological Sort", "Edit Distance", "N-Queens"};
            Difficulty[] difficulties = Difficulty.values();
            for (int i = 0; i < titles.length; i++) {
                CodingChallenge challenge = new CodingChallenge();
                challenge.setTitle(titles[i]);
                challenge.setDescription("Solve the " + titles[i] + " problem efficiently.");
                challenge.setDifficulty(difficulties[i % difficulties.length]);
                challenge.setBasePoints(100 + (i * 50));
                challenge.setTimeLimitMs(2000);
                challenge.setSetter(setter);
                challengeRepository.save(challenge);
            }
        }

        if (contestRepository.count() == 0) {
            LocalDateTime now = LocalDateTime.now();
            String[][] contests = {
                {"Spring Coding Sprint", "ACTIVE"},
                {"Algorithm Masters", "UPCOMING"},
                {"Data Structures Cup", "UPCOMING"},
                {"Weekly Challenge #1", "COMPLETED"},
                {"Open Hackathon 2026", "ACTIVE"}
            };
            for (String[] c : contests) {
                ProgrammingContest contest = new ProgrammingContest();
                contest.setTitle(c[0]);
                contest.setStatus(ContestStatus.valueOf(c[1]));
                contest.setStartTime(now.minusDays(1));
                contest.setEndTime(now.plusDays(7));
                contest.setCapacity(100);
                contestRepository.save(contest);
            }
        }
    }
}
