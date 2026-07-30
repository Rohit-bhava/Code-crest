package com.example.demo.service;

import com.example.demo.dto.SubmissionRequestDto;
import com.example.demo.dto.SubmissionResponseDto;
import com.example.demo.entity.*;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class SubmissionService {

    private final ChallengeSubmissionRepository submissionRepository;
    private final CodingChallengeRepository challengeRepository;
    private final ContestantProfileRepository contestantProfileRepository;
    private final ProgrammingContestRepository contestRepository;
    private final ContestRankingRepository contestRankingRepository;
    private final Random random = new Random();

    public SubmissionService(ChallengeSubmissionRepository submissionRepository,
                              CodingChallengeRepository challengeRepository,
                              ContestantProfileRepository contestantProfileRepository,
                              ProgrammingContestRepository contestRepository,
                              ContestRankingRepository contestRankingRepository) {
        this.submissionRepository = submissionRepository;
        this.challengeRepository = challengeRepository;
        this.contestantProfileRepository = contestantProfileRepository;
        this.contestRepository = contestRepository;
        this.contestRankingRepository = contestRankingRepository;
    }

    public SubmissionResponseDto processSubmission(SubmissionRequestDto dto, String username) {
        CodingChallenge challenge = challengeRepository.findById(dto.getChallengeId())
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + dto.getChallengeId()));

        ContestantProfile contestant = contestantProfileRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + username));

        ProgrammingContest contest = null;
        if (dto.getContestId() != null) {
            contest = contestRepository.findById(dto.getContestId())
                    .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + dto.getContestId()));
        }

        Verdict verdict = simulateVerdict();
        int executionTime = 50 + random.nextInt(950);
        int pointsEarned = 0;

        if (verdict == Verdict.ACCEPTED) {
            double efficiencyFactor = Math.max(0.5, 1.0 - (executionTime / (double) Math.max(1, challenge.getTimeLimitMs())));
            pointsEarned = (int) Math.round(challenge.getBasePoints() * efficiencyFactor);

            contestant.setTotalPoints(contestant.getTotalPoints() + pointsEarned);
            contestantProfileRepository.save(contestant);

            if (contest != null) {
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

        ChallengeSubmission submission = new ChallengeSubmission();
        submission.setSourceCode(dto.getSourceCode());
        submission.setVerdict(verdict);
        submission.setExecutionTimeMs(executionTime);
        submission.setPointsEarned(pointsEarned);
        submission.setContestant(contestant);
        submission.setChallenge(challenge);
        submission.setContest(contest);
        submission.setSubmittedAt(LocalDateTime.now());
        submission = submissionRepository.save(submission);

        String message = verdict == Verdict.ACCEPTED ? "Solution accepted" : "Solution did not pass all test cases";

        return new SubmissionResponseDto(submission.getId(), verdict.name(), pointsEarned, executionTime, message);
    }

    public void deleteSubmission(Long id) {
        ChallengeSubmission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));
        submissionRepository.delete(submission);
    }

    private Verdict simulateVerdict() {
        Verdict[] verdicts = Verdict.values();
        // weight towards ACCEPTED for a reasonable demo experience
        if (random.nextInt(100) < 60) {
            return Verdict.ACCEPTED;
        }
        return verdicts[1 + random.nextInt(verdicts.length - 1)];
    }
}