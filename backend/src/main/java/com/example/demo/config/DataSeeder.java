package com.example.demo.config;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository systemUserRepository;
    private final ContestantProfileRepository contestantProfileRepository;
    private final CodingChallengeRepository challengeRepository;
    private final ProgrammingContestRepository contestRepository;
    private final ChallengeSubmissionRepository submissionRepository;
    private final ContestRankingRepository contestRankingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(SystemUserRepository systemUserRepository,
                      ContestantProfileRepository contestantProfileRepository,
                      CodingChallengeRepository challengeRepository,
                      ProgrammingContestRepository contestRepository,
                      ChallengeSubmissionRepository submissionRepository,
                      ContestRankingRepository contestRankingRepository,
                      PasswordEncoder passwordEncoder) {
        this.systemUserRepository = systemUserRepository;
        this.contestantProfileRepository = contestantProfileRepository;
        this.challengeRepository = challengeRepository;
        this.contestRepository = contestRepository;
        this.submissionRepository = submissionRepository;
        this.contestRankingRepository = contestRankingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. ADMIN
        SystemUser setter = systemUserRepository.findByUsername("admin").orElseGet(() -> {
            SystemUser u = new SystemUser("admin", passwordEncoder.encode("Admin@123"), UserRole.ADMIN);
            return systemUserRepository.save(u);
        });

        // 2. CONTESTANT users with profiles
        SystemUser alice = systemUserRepository.findByUsername("alice").orElseGet(() -> {
            SystemUser u = new SystemUser("alice", passwordEncoder.encode("Alice@123"), UserRole.CONTESTANT);
            return systemUserRepository.save(u);
        });
        ContestantProfile aliceProfile = contestantProfileRepository.findByUsername("alice").orElseGet(() -> {
            ContestantProfile p = new ContestantProfile();
            p.setUsername("alice");
            p.setBio("Competitive programmer from Chennai.");
            p.setTotalPoints(0);
            p.setAccountStatus(AccountStatus.ACTIVE);
            p.setUser(alice);
            return contestantProfileRepository.save(p);
        });

        SystemUser bob = systemUserRepository.findByUsername("bob").orElseGet(() -> {
            SystemUser u = new SystemUser("bob", passwordEncoder.encode("Bob@1234"), UserRole.CONTESTANT);
            return systemUserRepository.save(u);
        });
        ContestantProfile bobProfile = contestantProfileRepository.findByUsername("bob").orElseGet(() -> {
            ContestantProfile p = new ContestantProfile();
            p.setUsername("bob");
            p.setBio("Algorithm enthusiast.");
            p.setTotalPoints(0);
            p.setAccountStatus(AccountStatus.ACTIVE);
            p.setUser(bob);
            return contestantProfileRepository.save(p);
        });

        // 4. Challenges
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

        // 5. Contests
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

        // 6. Seed submissions and leaderboard data if none exist
        if (submissionRepository.count() == 0) {
            List<CodingChallenge> challenges = challengeRepository.findAll();
            List<ProgrammingContest> contests = contestRepository.findAll();
            if (!challenges.isEmpty() && !contests.isEmpty()) {
                ProgrammingContest activeContest = contests.stream()
                        .filter(c -> c.getStatus() == ContestStatus.ACTIVE)
                        .findFirst().orElse(contests.get(0));

                // Enroll alice and bob in the active contest
                enrollIfAbsent(activeContest, aliceProfile);
                enrollIfAbsent(activeContest, bobProfile);

                // Alice: 3 accepted submissions
                int alicePoints = 0;
                for (int i = 0; i < 3; i++) {
                    CodingChallenge ch = challenges.get(i);
                    int pts = ch.getBasePoints();
                    alicePoints += pts;
                    ChallengeSubmission s = new ChallengeSubmission();
                    s.setSourceCode("// alice solution " + i);
                    s.setVerdict(Verdict.ACCEPTED);
                    s.setExecutionTimeMs(100 + i * 50);
                    s.setPointsEarned(pts);
                    s.setContestant(aliceProfile);
                    s.setChallenge(ch);
                    s.setContest(activeContest);
                    s.setSubmittedAt(LocalDateTime.now().minusHours(3 - i));
                    submissionRepository.save(s);
                }
                aliceProfile.setTotalPoints(alicePoints);
                contestantProfileRepository.save(aliceProfile);
                updateContestScore(activeContest, aliceProfile, alicePoints);

                // Bob: 2 accepted, 1 wrong answer
                int bobPoints = 0;
                for (int i = 0; i < 2; i++) {
                    CodingChallenge ch = challenges.get(i + 3);
                    int pts = ch.getBasePoints();
                    bobPoints += pts;
                    ChallengeSubmission s = new ChallengeSubmission();
                    s.setSourceCode("// bob solution " + i);
                    s.setVerdict(Verdict.ACCEPTED);
                    s.setExecutionTimeMs(200 + i * 30);
                    s.setPointsEarned(pts);
                    s.setContestant(bobProfile);
                    s.setChallenge(ch);
                    s.setContest(activeContest);
                    s.setSubmittedAt(LocalDateTime.now().minusHours(2 - i));
                    submissionRepository.save(s);
                }
                // Wrong answer submission for bob
                ChallengeSubmission wa = new ChallengeSubmission();
                wa.setSourceCode("// bob wrong attempt");
                wa.setVerdict(Verdict.WRONG_ANSWER);
                wa.setExecutionTimeMs(150);
                wa.setPointsEarned(0);
                wa.setContestant(bobProfile);
                wa.setChallenge(challenges.get(5));
                wa.setContest(null);
                wa.setSubmittedAt(LocalDateTime.now().minusMinutes(30));
                submissionRepository.save(wa);

                bobProfile.setTotalPoints(bobPoints);
                contestantProfileRepository.save(bobProfile);
                updateContestScore(activeContest, bobProfile, bobPoints);
            }
        }
    }

    private void enrollIfAbsent(ProgrammingContest contest, ContestantProfile profile) {
        contestRankingRepository.findByContestIdAndContestantId(contest.getId(), profile.getId())
                .orElseGet(() -> {
                    ContestRanking r = new ContestRanking();
                    r.setContest(contest);
                    r.setContestant(profile);
                    r.setCurrentScore(0);
                    r.setPenaltyTime(0);
                    return contestRankingRepository.save(r);
                });
    }

    private void updateContestScore(ProgrammingContest contest, ContestantProfile profile, int score) {
        contestRankingRepository.findByContestIdAndContestantId(contest.getId(), profile.getId())
                .ifPresent(r -> {
                    r.setCurrentScore(score);
                    contestRankingRepository.save(r);
                });
    }
}
