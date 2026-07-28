package com.example.codecrest.service;

import com.example.codecrest.entity.ContestRanking;
import com.example.codecrest.entity.ContestantProfile;
import com.example.codecrest.entity.ProgrammingContest;
import com.example.codecrest.enums.ContestStatus;
import com.example.codecrest.exception.BusinessValidationException;
import com.example.codecrest.exception.ResourceNotFoundException;
import com.example.codecrest.repository.ContestRankingRepository;
import com.example.codecrest.repository.ContestantProfileRepository;
import com.example.codecrest.repository.ProgrammingContestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContestService {

    @Autowired
    private ProgrammingContestRepository contestRepository;
    @Autowired
    private ContestantProfileRepository profileRepository;
    @Autowired
    private ContestRankingRepository rankingRepository;

    public List<ProgrammingContest> getAllContests() {
        return contestRepository.findAll();
    }

    public Page<ProgrammingContest> getAllContestsPaged(Pageable pageable) {
        return contestRepository.findAll(pageable);
    }

    public ProgrammingContest getContestById(Long id) {
        return contestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + id));
    }

    public void createContest(ProgrammingContest contest) {
        if (contest.getStartTime().isBefore(LocalDateTime.now())) {
            throw new BusinessValidationException("Start time must be in the future");
        }
        if (contest.getStartTime().isAfter(contest.getEndTime())) {
            throw new BusinessValidationException("Start time must precede end time");
        }
        if (contest.getCapacity() <= 0) {
            throw new BusinessValidationException("Capacity must be a positive integer");
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
            throw new BusinessValidationException("Enrollment is only allowed for UPCOMING contests.");
        }

        long enrolledCount = rankingRepository.countByContestId(contestId);
        if (enrolledCount >= contest.getCapacity()) {
            throw new BusinessValidationException("Contest has reached maximum capacity.");
        }

        ContestantProfile profile = profileRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Contestant profile not found."));

        if (rankingRepository.findByContestIdAndContestantId(contestId, profile.getId()).isPresent()) {
            throw new BusinessValidationException("Participant already enrolled in this contest.");
        }

        ContestRanking ranking = ContestRanking.builder()
                .contest(contest)
                .contestant(profile)
                .currentScore(0)
                .penaltyTime(0)
                .build();

        rankingRepository.save(ranking);
    }
}