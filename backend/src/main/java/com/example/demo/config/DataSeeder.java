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
    private final ChallengeTestCaseRepository testCaseRepository;
    private final ProgrammingContestRepository contestRepository;
    private final ChallengeSubmissionRepository submissionRepository;
    private final ContestRankingRepository contestRankingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(SystemUserRepository systemUserRepository,
                      ContestantProfileRepository contestantProfileRepository,
                      CodingChallengeRepository challengeRepository,
                      ChallengeTestCaseRepository testCaseRepository,
                      ProgrammingContestRepository contestRepository,
                      ChallengeSubmissionRepository submissionRepository,
                      ContestRankingRepository contestRankingRepository,
                      PasswordEncoder passwordEncoder) {
        this.systemUserRepository = systemUserRepository;
        this.contestantProfileRepository = contestantProfileRepository;
        this.challengeRepository = challengeRepository;
        this.testCaseRepository = testCaseRepository;
        this.contestRepository = contestRepository;
        this.submissionRepository = submissionRepository;
        this.contestRankingRepository = contestRankingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // 1. ADMIN user
        SystemUser admin = systemUserRepository.findByUsername("admin").orElseGet(() -> {
            SystemUser u = new SystemUser("admin", passwordEncoder.encode("Admin@123"), UserRole.ADMIN);
            return systemUserRepository.save(u);
        });

        // 2. CONTESTANT users
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

        // 3. Seed challenges with test cases
        if (challengeRepository.count() == 0) {
            seedChallenges(admin);
        }

        // 4. Contests
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

        // 5. Seed sample submissions
        if (submissionRepository.count() == 0) {
            List<CodingChallenge> challenges = challengeRepository.findAll();
            List<ProgrammingContest> contests = contestRepository.findAll();
            if (!challenges.isEmpty() && !contests.isEmpty()) {
                ProgrammingContest activeContest = contests.stream()
                        .filter(c -> c.getStatus() == ContestStatus.ACTIVE)
                        .findFirst().orElse(contests.get(0));

                enrollIfAbsent(activeContest, aliceProfile);
                enrollIfAbsent(activeContest, bobProfile);

                int alicePoints = 0;
                for (int i = 0; i < Math.min(3, challenges.size()); i++) {
                    CodingChallenge ch = challenges.get(i);
                    int pts = ch.getBasePoints();
                    alicePoints += pts;
                    ChallengeSubmission s = new ChallengeSubmission();
                    s.setSourceCode("# alice solution " + i);
                    s.setLanguage("python");
                    s.setVerdict(Verdict.ACCEPTED);
                    s.setExecutionTimeMs(100 + i * 50);
                    s.setPointsEarned(pts);
                    s.setPassedTestCases(3);
                    s.setTotalTestCases(3);
                    s.setContestant(aliceProfile);
                    s.setChallenge(ch);
                    s.setContest(activeContest);
                    s.setSubmittedAt(LocalDateTime.now().minusHours(3 - i));
                    submissionRepository.save(s);
                }
                aliceProfile.setTotalPoints(alicePoints);
                contestantProfileRepository.save(aliceProfile);
                updateContestScore(activeContest, aliceProfile, alicePoints);

                int bobPoints = 0;
                for (int i = 0; i < Math.min(2, challenges.size()); i++) {
                    CodingChallenge ch = challenges.get(i);
                    int pts = ch.getBasePoints();
                    bobPoints += pts;
                    ChallengeSubmission s = new ChallengeSubmission();
                    s.setSourceCode("# bob solution " + i);
                    s.setLanguage("python");
                    s.setVerdict(Verdict.ACCEPTED);
                    s.setExecutionTimeMs(200 + i * 30);
                    s.setPointsEarned(pts);
                    s.setPassedTestCases(3);
                    s.setTotalTestCases(3);
                    s.setContestant(bobProfile);
                    s.setChallenge(ch);
                    s.setContest(activeContest);
                    s.setSubmittedAt(LocalDateTime.now().minusHours(2 - i));
                    submissionRepository.save(s);
                }
                bobProfile.setTotalPoints(bobPoints);
                contestantProfileRepository.save(bobProfile);
                updateContestScore(activeContest, bobProfile, bobPoints);
            }
        }
    }

    private void seedChallenges(SystemUser admin) {

        // Challenge 1: Sum of Two Numbers
        CodingChallenge c1 = new CodingChallenge();
        c1.setTitle("Sum of Two Numbers");
        c1.setDescription("Given two integers A and B, print their sum.");
        c1.setInputFormat("Two space-separated integers A and B on a single line.");
        c1.setOutputFormat("Print a single integer — the sum of A and B.");
        c1.setConstraints("1 <= A, B <= 10^9");
        c1.setSampleInput("5 7");
        c1.setSampleOutput("12");
        c1.setDifficulty(Difficulty.EASY);
        c1.setBasePoints(100);
        c1.setTimeLimitMs(2000);
        c1.setSetter(admin);
        challengeRepository.save(c1);
        addTestCases(c1,
            new String[]{"5 7",   "12",  "false"},
            new String[]{"1 1",   "2",   "false"},
            new String[]{"100 200", "300", "true"},
            new String[]{"999999999 1", "1000000000", "true"}
        );

        // Challenge 2: Square of a Number
        CodingChallenge c2 = new CodingChallenge();
        c2.setTitle("Square of a Number");
        c2.setDescription("Given an integer N, print its square.");
        c2.setInputFormat("A single integer N.");
        c2.setOutputFormat("Print N * N.");
        c2.setConstraints("1 <= N <= 1000");
        c2.setSampleInput("5");
        c2.setSampleOutput("25");
        c2.setDifficulty(Difficulty.EASY);
        c2.setBasePoints(100);
        c2.setTimeLimitMs(2000);
        c2.setSetter(admin);
        challengeRepository.save(c2);
        addTestCases(c2,
            new String[]{"5",   "25",   "false"},
            new String[]{"10",  "100",  "false"},
            new String[]{"1",   "1",    "true"},
            new String[]{"1000","1000000","true"}
        );

        // Challenge 3: Reverse a String
        CodingChallenge c3 = new CodingChallenge();
        c3.setTitle("Reverse a String");
        c3.setDescription("Given a string S, print it reversed.");
        c3.setInputFormat("A single string S (no spaces).");
        c3.setOutputFormat("Print the reversed string.");
        c3.setConstraints("1 <= |S| <= 10^5");
        c3.setSampleInput("hello");
        c3.setSampleOutput("olleh");
        c3.setDifficulty(Difficulty.EASY);
        c3.setBasePoints(100);
        c3.setTimeLimitMs(2000);
        c3.setSetter(admin);
        challengeRepository.save(c3);
        addTestCases(c3,
            new String[]{"hello",   "olleh",   "false"},
            new String[]{"abcde",   "edcba",   "false"},
            new String[]{"a",       "a",       "true"},
            new String[]{"racecar", "racecar", "true"}
        );

        // Challenge 4: Factorial
        CodingChallenge c4 = new CodingChallenge();
        c4.setTitle("Factorial of N");
        c4.setDescription("Given a non-negative integer N, print N! (N factorial).");
        c4.setInputFormat("A single integer N.");
        c4.setOutputFormat("Print the factorial of N.");
        c4.setConstraints("0 <= N <= 12");
        c4.setSampleInput("5");
        c4.setSampleOutput("120");
        c4.setDifficulty(Difficulty.EASY);
        c4.setBasePoints(150);
        c4.setTimeLimitMs(2000);
        c4.setSetter(admin);
        challengeRepository.save(c4);
        addTestCases(c4,
            new String[]{"5",  "120",   "false"},
            new String[]{"0",  "1",     "false"},
            new String[]{"1",  "1",     "true"},
            new String[]{"12", "479001600", "true"}
        );

        // Challenge 5: FizzBuzz
        CodingChallenge c5 = new CodingChallenge();
        c5.setTitle("FizzBuzz");
        c5.setDescription("Given N, print numbers from 1 to N. For multiples of 3 print Fizz, multiples of 5 print Buzz, multiples of both print FizzBuzz.");
        c5.setInputFormat("A single integer N.");
        c5.setOutputFormat("Print N lines as described.");
        c5.setConstraints("1 <= N <= 100");
        c5.setSampleInput("5");
        c5.setSampleOutput("1\n2\nFizz\n4\nBuzz");
        c5.setDifficulty(Difficulty.EASY);
        c5.setBasePoints(150);
        c5.setTimeLimitMs(2000);
        c5.setSetter(admin);
        challengeRepository.save(c5);
        addTestCases(c5,
            new String[]{"5",  "1\n2\nFizz\n4\nBuzz", "false"},
            new String[]{"3",  "1\n2\nFizz",           "false"},
            new String[]{"15", "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", "true"},
            new String[]{"1",  "1",                    "true"}
        );

        // Challenge 6: Count Vowels
        CodingChallenge c6 = new CodingChallenge();
        c6.setTitle("Count Vowels");
        c6.setDescription("Given a string, count the number of vowels (a, e, i, o, u — case insensitive).");
        c6.setInputFormat("A single string S.");
        c6.setOutputFormat("Print the count of vowels.");
        c6.setConstraints("1 <= |S| <= 10^5");
        c6.setSampleInput("Hello World");
        c6.setSampleOutput("3");
        c6.setDifficulty(Difficulty.EASY);
        c6.setBasePoints(100);
        c6.setTimeLimitMs(2000);
        c6.setSetter(admin);
        challengeRepository.save(c6);
        addTestCases(c6,
            new String[]{"Hello World", "3",  "false"},
            new String[]{"aeiou",       "5",  "false"},
            new String[]{"bcdfg",       "0",  "true"},
            new String[]{"AEIOUaeiou",  "10", "true"}
        );

        // Challenge 7: Two Sum
        CodingChallenge c7 = new CodingChallenge();
        c7.setTitle("Two Sum");
        c7.setDescription("Given an array of N integers and a target T, find two indices i and j such that arr[i] + arr[j] == T. Print the indices (0-based, smaller first). Guaranteed exactly one solution.");
        c7.setInputFormat("Line 1: N and T\nLine 2: N space-separated integers");
        c7.setOutputFormat("Print two space-separated indices i j.");
        c7.setConstraints("2 <= N <= 10^4\n-10^9 <= arr[i] <= 10^9");
        c7.setSampleInput("4 9\n2 7 11 15");
        c7.setSampleOutput("0 1");
        c7.setDifficulty(Difficulty.MEDIUM);
        c7.setBasePoints(200);
        c7.setTimeLimitMs(3000);
        c7.setSetter(admin);
        challengeRepository.save(c7);
        addTestCases(c7,
            new String[]{"4 9\n2 7 11 15", "0 1", "false"},
            new String[]{"3 6\n3 2 4",     "1 2", "false"},
            new String[]{"2 6\n3 3",       "0 1", "true"},
            new String[]{"5 10\n1 2 3 4 6","1 4", "true"}
        );

        // Challenge 8: Palindrome Check
        CodingChallenge c8 = new CodingChallenge();
        c8.setTitle("Palindrome Check");
        c8.setDescription("Given a string S, print YES if it is a palindrome, NO otherwise.");
        c8.setInputFormat("A single string S (no spaces, lowercase).");
        c8.setOutputFormat("Print YES or NO.");
        c8.setConstraints("1 <= |S| <= 10^5");
        c8.setSampleInput("racecar");
        c8.setSampleOutput("YES");
        c8.setDifficulty(Difficulty.EASY);
        c8.setBasePoints(100);
        c8.setTimeLimitMs(2000);
        c8.setSetter(admin);
        challengeRepository.save(c8);
        addTestCases(c8,
            new String[]{"racecar", "YES", "false"},
            new String[]{"hello",   "NO",  "false"},
            new String[]{"a",       "YES", "true"},
            new String[]{"abba",    "YES", "true"}
        );

        // Challenge 9: Binary Search
        CodingChallenge c9 = new CodingChallenge();
        c9.setTitle("Binary Search");
        c9.setDescription("Given a sorted array of N integers and a target T, print the index of T. If not found, print -1.");
        c9.setInputFormat("Line 1: N and T\nLine 2: N sorted space-separated integers");
        c9.setOutputFormat("Print the 0-based index of T or -1.");
        c9.setConstraints("1 <= N <= 10^5\n-10^9 <= arr[i], T <= 10^9");
        c9.setSampleInput("5 7\n1 3 5 7 9");
        c9.setSampleOutput("3");
        c9.setDifficulty(Difficulty.MEDIUM);
        c9.setBasePoints(200);
        c9.setTimeLimitMs(2000);
        c9.setSetter(admin);
        challengeRepository.save(c9);
        addTestCases(c9,
            new String[]{"5 7\n1 3 5 7 9",  "3",  "false"},
            new String[]{"5 6\n1 3 5 7 9",  "-1", "false"},
            new String[]{"1 1\n1",           "0",  "true"},
            new String[]{"4 4\n1 2 3 4",     "3",  "true"}
        );

        // Challenge 10: Maximum Subarray
        CodingChallenge c10 = new CodingChallenge();
        c10.setTitle("Maximum Subarray Sum");
        c10.setDescription("Given an array of N integers, find the contiguous subarray with the largest sum and print that sum (Kadane's Algorithm).");
        c10.setInputFormat("Line 1: N\nLine 2: N space-separated integers");
        c10.setOutputFormat("Print the maximum subarray sum.");
        c10.setConstraints("1 <= N <= 10^5\n-10^4 <= arr[i] <= 10^4");
        c10.setSampleInput("8\n-2 1 -3 4 -1 2 1 -5 4");
        c10.setSampleOutput("6");
        c10.setDifficulty(Difficulty.MEDIUM);
        c10.setBasePoints(250);
        c10.setTimeLimitMs(3000);
        c10.setSetter(admin);
        challengeRepository.save(c10);
        addTestCases(c10,
            new String[]{"8\n-2 1 -3 4 -1 2 1 -5 4", "6",  "false"},
            new String[]{"1\n-1",                      "-1", "false"},
            new String[]{"4\n1 2 3 4",                 "10", "true"},
            new String[]{"5\n-1 -2 -3 -4 -5",          "-1", "true"}
        );
    }

    // varargs rows: each row is {input, expectedOutput, hidden}
    private void addTestCases(CodingChallenge challenge, String[]... rows) {
        for (int i = 0; i < rows.length; i++) {
            ChallengeTestCase tc = new ChallengeTestCase();
            tc.setChallenge(challenge);
            tc.setInput(rows[i][0]);
            tc.setExpectedOutput(rows[i][1]);
            tc.setHidden(Boolean.parseBoolean(rows[i][2]));
            tc.setTestCaseOrder(i + 1);
            testCaseRepository.save(tc);
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
