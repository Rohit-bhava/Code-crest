package com.codecrest.service;

import com.codecrest.entity.ContestRanking;
import com.codecrest.entity.ContestantProfile;
import com.codecrest.entity.ProgrammingContest;
import com.codecrest.enums.ContestStatus;
import com.codecrest.exception.BusinessValidationException;
import com.codecrest.exception.ResourceNotFoundException;
import com.codecrest.repository.ContestRankingRepository;
import com.codecrest.repository.ContestantProfileRepository;
import com.codecrest.repository.ProgrammingContestRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContestService {

    private final ProgrammingContestRepository contestRepository;
    private final ContestantProfileRepository profileRepository;
    private final ContestRankingRepository rankingRepository;

    public ContestService(ProgrammingContestRepository contestRepository,
                          ContestantProfileRepository profileRepository,
                          ContestRankingRepository rankingRepository) {
        this.contestRepository = contestRepository;
        this.profileRepository = profileRepository;
        this.rankingRepository = rankingRepository;
    }

    public Page<ProgrammingContest> getAllContestsPaged(Pageable pageable) {
        return contestRepository.findAll(pageable);
    }

    public List<ProgrammingContest> getAllContests() {
        return contestRepository.findAll();
    }

    public ProgrammingContest getContestById(Long id) {
        return contestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + id));
    }

    public void createContest(ProgrammingContest contest) {
        if (contest.getStartTime().isAfter(contest.getEndTime())) {
            throw new BusinessValidationException("Start time must precede end time");
        }
        contestRepository.save(contest);
    }

    public void updateContest(Long id, ProgrammingContest details) {
        ProgrammingContest contest = getContestById(id);
        if (details.getStartTime().isAfter(details.getEndTime())) {
            throw new BusinessValidationException("Start time must precede end time");
        }
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
            throw new BusinessValidationException("Can only enroll in UPCOMING contests");
        }

        ContestantProfile profile = profileRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Contestant profile not found"));

        if (rankingRepository.existsByContestIdAndContestantId(contestId, profile.getId())) {
            throw new BusinessValidationException("User already enrolled in this contest");
        }

        long currentEnrollments = rankingRepository.countByContestId(contestId);
        if (currentEnrollments >= contest.getCapacity()) {
            throw new BusinessValidationException("Contest capacity has been reached");
        }

        ContestRanking ranking = new ContestRanking();
        ranking.setContest(contest);
        ranking.setContestant(profile);
        ranking.setCurrentScore(0);
        ranking.setPenaltyTime(0);

        rankingRepository.save(ranking);
    }
}