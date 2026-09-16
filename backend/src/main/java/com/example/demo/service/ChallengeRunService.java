package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChallengeRunService {

    private final CodingChallengeRepository challengeRepository;
    private final ChallengeTestCaseRepository testCaseRepository;
    private final ChallengeSubmissionRepository submissionRepository;
    private final ContestantProfileRepository contestantProfileRepository;
    private final ProgrammingContestRepository contestRepository;
    private final ContestRankingRepository contestRankingRepository;
    private final CodeExecutionService executionService;

    public ChallengeRunService(CodingChallengeRepository challengeRepository,
                                ChallengeTestCaseRepository testCaseRepository,
                                ChallengeSubmissionRepository submissionRepository,
                                ContestantProfileRepository contestantProfileRepository,
                                ProgrammingContestRepository contestRepository,
                                ContestRankingRepository contestRankingRepository,
                                CodeExecutionService executionService) {
        this.challengeRepository = challengeRepository;
        this.testCaseRepository = testCaseRepository;
        this.submissionRepository = submissionRepository;
        this.contestantProfileRepository = contestantProfileRepository;
        this.contestRepository = contestRepository;
        this.contestRankingRepository = contestRankingRepository;
        this.executionService = executionService;
    }

    // RUN — only visible test cases, no submission saved
    public RunCodeResponse run(Long challengeId, RunCodeRequest req) {
        if (req.getCode() == null || req.getCode().isBlank())
            throw new BusinessValidationException("Code cannot be empty");
        if (!executionService.isSupported(req.getLanguage()))
            throw new BusinessValidationException("Unsupported language: " + req.getLanguage());

        CodingChallenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found: " + challengeId));

        List<ChallengeTestCase> visibleCases =
                testCaseRepository.findByChallengeIdAndHiddenFalseOrderByTestCaseOrderAsc(challengeId);

        int timeLimitMs = challenge.getTimeLimitMs() != null ? challenge.getTimeLimitMs() : 5000;
        List<TestCaseResult> results = new ArrayList<>();
        int passed = 0;

        RunCodeResponse response = new RunCodeResponse();

        for (int i = 0; i < visibleCases.size(); i++) {
            ChallengeTestCase tc = visibleCases.get(i);
            CodeExecutionService.ExecutionResult exec =
                    executionService.execute(req.getLanguage(), req.getCode(), tc.getInput(), timeLimitMs);

            String error = null;
            String actual = exec.stdout;

            if (exec.timedOut) {
                error = "Time Limit Exceeded";
                actual = "";
            } else if (!exec.stderr.isBlank()) {
                error = exec.stderr;
                actual = "";
            }

            TestCaseResult r = executionService.buildResult(
                    i + 1, tc.getInput(), tc.getExpectedOutput(), actual, error, false);
            if ("PASSED".equals(r.getStatus())) passed++;
            results.add(r);

            // Stop on compile error
            if (error != null && (error.contains("error:") || error.contains("SyntaxError")
                    || error.contains("Error:") || error.contains("error\n"))) {
                response.setStatus("COMPILATION_ERROR");
                response.setError(error);
                response.setPassed(0);
                response.setTotal(visibleCases.size());
                response.setTestCases(results);
                return response;
            }
        }

        response.setStatus(visibleCases.isEmpty() ? "NO_TEST_CASES" : "COMPLETED");
        response.setPassed(passed);
        response.setTotal(visibleCases.size());
        response.setTestCases(results);
        return response;
    }

    // SUBMIT — runs ALL test cases (visible + hidden), saves submission
    public SubmitCodeResponse submit(Long challengeId, SubmitCodeRequest req, String username) {
        if (req.getCode() == null || req.getCode().isBlank())
            throw new BusinessValidationException("Code cannot be empty");
        if (!executionService.isSupported(req.getLanguage()))
            throw new BusinessValidationException("Unsupported language: " + req.getLanguage());

        CodingChallenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found: " + challengeId));

        ContestantProfile contestant = contestantProfileRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for: " + username));

        List<ChallengeTestCase> allCases =
                testCaseRepository.findByChallengeIdOrderByTestCaseOrderAsc(challengeId);

        int timeLimitMs = challenge.getTimeLimitMs() != null ? challenge.getTimeLimitMs() : 5000;
        int passed = 0;
        int total = allCases.size();
        long startTime = System.currentTimeMillis();
        Verdict verdict = Verdict.ACCEPTED;
        String errorMsg = null;

        for (ChallengeTestCase tc : allCases) {
            CodeExecutionService.ExecutionResult exec =
                    executionService.execute(req.getLanguage(), req.getCode(), tc.getInput(), timeLimitMs);

            if (exec.timedOut) {
                verdict = Verdict.TIME_LIMIT_EXCEEDED;
                break;
            }
            if (!exec.stderr.isBlank()) {
                String err = exec.stderr;
                verdict = (err.contains("error:") || err.contains("SyntaxError") || err.contains("Error:"))
                        ? Verdict.COMPILATION_ERROR : Verdict.RUNTIME_ERROR;
                errorMsg = err;
                break;
            }
            String actual = executionService.normalizeOutput(exec.stdout);
            String expected = executionService.normalizeOutput(tc.getExpectedOutput());
            if (actual.equals(expected)) {
                passed++;
            } else {
                verdict = Verdict.WRONG_ANSWER;
            }
        }

        int executionTime = (int) (System.currentTimeMillis() - startTime);
        int pointsEarned = 0;

        if (verdict == Verdict.ACCEPTED && passed == total && total > 0) {
            double factor = Math.max(0.5, 1.0 - (executionTime / (double) Math.max(1, timeLimitMs)));
            pointsEarned = (int) Math.round(challenge.getBasePoints() * factor);

            boolean alreadyAccepted = submissionRepository
                    .findByContestantId(contestant.getId()).stream()
                    .anyMatch(s -> s.getChallenge().getId().equals(challengeId)
                            && s.getVerdict() == Verdict.ACCEPTED);

            if (!alreadyAccepted) {
                contestant.setTotalPoints(contestant.getTotalPoints() + pointsEarned);
                contestantProfileRepository.save(contestant);
            } else {
                pointsEarned = 0;
            }

            if (req.getContestId() != null) {
                ProgrammingContest contest = contestRepository.findById(req.getContestId()).orElse(null);
                if (contest != null && !alreadyAccepted) {
                    ContestRanking ranking = contestRankingRepository
                            .findByContestIdAndContestantId(contest.getId(), contestant.getId())
                            .orElseGet(() -> {
                                ContestRanking r = new ContestRanking();
                                r.setContest(contest);
                                r.setContestant(contestant);
                                r.setCurrentScore(0);
                                r.setPenaltyTime(0);
                                return r;
                            });
                    ranking.setCurrentScore(ranking.getCurrentScore() + pointsEarned);
                    contestRankingRepository.save(ranking);
                }
            }
        }

        ChallengeSubmission submission = new ChallengeSubmission();
        submission.setSourceCode(req.getCode());
        submission.setLanguage(req.getLanguage());
        submission.setVerdict(verdict);
        submission.setExecutionTimeMs(executionTime);
        submission.setPointsEarned(pointsEarned);
        submission.setPassedTestCases(passed);
        submission.setTotalTestCases(total);
        submission.setContestant(contestant);
        submission.setChallenge(challenge);
        submission.setSubmittedAt(LocalDateTime.now());
        if (req.getContestId() != null) {
            contestRepository.findById(req.getContestId()).ifPresent(submission::setContest);
        }
        submission = submissionRepository.save(submission);

        SubmitCodeResponse response = new SubmitCodeResponse();
        response.setSubmissionId(submission.getId());
        response.setStatus(verdict.name());
        response.setPassed(passed);
        response.setTotal(total);
        response.setExecutionTime(executionTime);
        response.setPointsEarned(pointsEarned);
        response.setMessage(buildMessage(verdict, passed, total, errorMsg));
        return response;
    }

    private String buildMessage(Verdict v, int passed, int total, String error) {
        return switch (v) {
            case ACCEPTED -> "All test cases passed!";
            case WRONG_ANSWER -> passed + "/" + total + " test cases passed";
            case COMPILATION_ERROR -> "Compilation Error: " + (error != null ? error : "");
            case RUNTIME_ERROR -> "Runtime Error: " + (error != null ? error : "");
            case TIME_LIMIT_EXCEEDED -> "Time Limit Exceeded";
        };
    }
}
