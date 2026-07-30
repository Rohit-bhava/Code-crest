package com.example.demo.service;

import com.example.demo.dto.RankingResponseDto;
import com.example.demo.entity.ContestRanking;
import com.example.demo.entity.ContestantProfile;
import com.example.demo.repository.ContestRankingRepository;
import com.example.demo.repository.ContestantProfileRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class LeaderboardService {

    private final ContestantProfileRepository contestantProfileRepository;
    private final ContestRankingRepository contestRankingRepository;

    public LeaderboardService(ContestantProfileRepository contestantProfileRepository,
                              ContestRankingRepository contestRankingRepository) {
        this.contestantProfileRepository = contestantProfileRepository;
        this.contestRankingRepository = contestRankingRepository;
    }

    public Page<RankingResponseDto> getGlobalLeaderboard(Pageable pageable) {
        Page<ContestantProfile> profiles = contestantProfileRepository.findAllByOrderByTotalPointsDesc(pageable);

        int startRank = (int) pageable.getOffset() + 1;
        return profiles.map(profile -> new RankingResponseDto(
                startRank + profiles.getContent().indexOf(profile),
                profile.getUsername(),
                profile.getTotalPoints()
        ));
    }

    public Page<RankingResponseDto> getContestLeaderboard(Long contestId, Pageable pageable) {
        Page<ContestRanking> rankings = contestRankingRepository
                .findByContestIdOrderByCurrentScoreDescPenaltyTimeAsc(contestId, pageable);

        int startRank = (int) pageable.getOffset() + 1;
        return rankings.map(ranking -> new RankingResponseDto(
                startRank + rankings.getContent().indexOf(ranking),
                ranking.getContestant().getUsername(),
                ranking.getCurrentScore()
        ));
    }
}