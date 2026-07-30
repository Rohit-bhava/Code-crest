package com.example.codecrest.service;

import com.example.codecrest.dto.SubmissionRequestDto;
import com.example.codecrest.dto.SubmissionResponseDto;
import com.example.codecrest.entity.*;
import com.example.codecrest.enums.Verdict;
import com.example.codecrest.exception.ResourceNotFoundException;
import com.example.codecrest.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubmissionService {

    @Autowired
    private ChallengeSubmissionRepository submissionRepository;
    @Autowired
    private CodingChallengeRepository challengeRepository;
    @Autowired
    private ContestantProfileRepository profileRepository;
    @Autowired
    private ProgrammingContestRepository contestRepository;
    @Autowired
    private ContestRankingRepository rankingRepository;

    public SubmissionResponseDto processSubmission(SubmissionRequestDto dto, String username) {
        ContestantProfile contestant = profileRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Contestant profile not found"));

        CodingChallenge challenge = challengeRepository.findById(dto.getChallengeId())
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found"));

        ProgrammingContest contest = null;
        if (dto.getContestId() != null) {
            contest = contestRepository.findById(dto.getContestId()).orElse(null);
        }

        Verdict verdict = Verdict.ACCEPTED;
        int executionTime = (int) (Math.random() * 200) + 50;
        int pointsEarned = verdict == Verdict.ACCEPTED ? challenge.getBasePoints() : 0;

        ChallengeSubmission submission = new ChallengeSubmission();
        submission.setSourceCode(dto.getSourceCode());
        submission.setVerdict(verdict);
        submission.setExecutionTimeMs(executionTime);
        submission.setPointsEarned(pointsEarned);
        submission.setContestant(contestant);
        submission.setChallenge(challenge);
        submission.setContest(contest);
        submission.setSubmittedAt(LocalDateTime.now());

        submissionRepository.save(submission);

        if (verdict == Verdict.ACCEPTED) {
            contestant.setTotalPoints(contestant.getTotalPoints() + pointsEarned);
            profileRepository.save(contestant);

            if (contest != null) {
                final ProgrammingContest finalContest = contest;
                ContestRanking ranking = rankingRepository.findByContestIdAndContestantId(contest.getId(), contestant.getId())
                        .orElseGet(() -> {
                            ContestRanking newRanking = new ContestRanking();
                            newRanking.setContest(finalContest);
                            newRanking.setContestant(contestant);
                            newRanking.setCurrentScore(0);
                            newRanking.setPenaltyTime(0);
                            return newRanking;
                        });
                ranking.setCurrentScore(ranking.getCurrentScore() + pointsEarned);
                rankingRepository.save(ranking);
            }
        }

        SubmissionResponseDto response = new SubmissionResponseDto();
        response.setSubmissionId(submission.getId());
        response.setVerdict(verdict.name());
        response.setPointsEarned(pointsEarned);
        response.setExecutionTimeMs(executionTime);
        response.setMessage("Submission evaluated successfully");

        return response;
    }

    public Page<ChallengeSubmission> getAllSubmissions(Pageable pageable) {
        return submissionRepository.findAll(pageable);
    }

    public List<ChallengeSubmission> getSubmissionsByContestant(Long contestantId) {
        return submissionRepository.findByContestantId(contestantId);
    }

    public void deleteSubmission(Long id) {
        ChallengeSubmission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));
        submissionRepository.delete(submission);
    }
}