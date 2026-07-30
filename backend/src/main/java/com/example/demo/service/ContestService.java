package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ContestRankingRepository;
import com.example.demo.repository.ContestantProfileRepository;
import com.example.demo.repository.ProgrammingContestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContestService {

    private final ProgrammingContestRepository contestRepository;
    private final ContestantProfileRepository contestantProfileRepository;
    private final ContestRankingRepository contestRankingRepository;

    public ContestService(ProgrammingContestRepository contestRepository,
                           ContestantProfileRepository contestantProfileRepository,
                           ContestRankingRepository contestRankingRepository) {
        this.contestRepository = contestRepository;
        this.contestantProfileRepository = contestantProfileRepository;
        this.contestRankingRepository = contestRankingRepository;
    }

    public List<ProgrammingContest> getAllContests() {
        return contestRepository.findAll();
    }

    public ProgrammingContest getContestById(Long id) {
        return contestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + id));
    }

    public void createContest(ProgrammingContest contest) {
        if (contest.getStartTime() != null && contest.getEndTime() != null
                && !contest.getStartTime().isBefore(contest.getEndTime())) {
            throw new BusinessValidationException("Start time must precede end time");
        }
        if (contest.getStatus() == null) {
            contest.setStatus(ContestStatus.UPCOMING);
        }
        contestRepository.save(contest);
    }

    public void updateContest(Long id, ProgrammingContest details) {
        ProgrammingContest contest = getContestById(id);
        contest.setTitle(details.getTitle());
        contest.setStartTime(details.getStartTime());
        contest.setEndTime(details.getEndTime());
        contest.setCapacity(details.getCapacity());
        contest.setStatus(details.getStatus());
        contestRepository.save(contest);
    }

    public void deleteContest(Long id) {
        ProgrammingContest contest = getContestById(id);
        contestRepository.delete(contest);
    }

    public void enrollParticipant(Long contestId, String username) {
        ProgrammingContest contest = getContestById(contestId);

        if (contest.getStatus() != ContestStatus.UPCOMING) {
            throw new BusinessValidationException("Cannot enroll in a contest that is not upcoming");
        }

        ContestantProfile contestant = contestantProfileRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + username));

        contestRankingRepository.findByContestIdAndContestantId(contestId, contestant.getId())
                .ifPresent(r -> {
                    throw new BusinessValidationException("Already enrolled in this contest");
                });

        ContestRanking ranking = new ContestRanking();
        ranking.setContest(contest);
        ranking.setContestant(contestant);
        ranking.setCurrentScore(0);
        ranking.setPenaltyTime(0);
        contestRankingRepository.save(ranking);
    }
}