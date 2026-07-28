package com.codecrest.service;

import com.codecrest.dto.RankingResponseDto;
import com.codecrest.entity.ContestRanking;
import com.codecrest.entity.ContestantProfile;
import com.codecrest.repository.ContestRankingRepository;
import com.codecrest.repository.ContestantProfileRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LeaderboardService {

    private final ContestantProfileRepository profileRepository;
    private final ContestRankingRepository rankingRepository;

    public LeaderboardService(ContestantProfileRepository profileRepository, ContestRankingRepository rankingRepository) {
        this.profileRepository = profileRepository;
        this.rankingRepository = rankingRepository;
    }

    public Page<RankingResponseDto> getGlobalLeaderboard(Pageable pageable) {
        Page<ContestantProfile> profiles = profileRepository.findAllByOrderByTotalPointsDesc(pageable);
        List<RankingResponseDto> rankings = new ArrayList<>();

        int startRank = (int) pageable.getOffset() + 1;
        for (int i = 0; i < profiles.getContent().size(); i++) {
            ContestantProfile p = profiles.getContent().get(i);
            int currentRank = startRank + i;
            p.setGlobalRank(currentRank);
            rankings.add(new RankingResponseDto(currentRank, p.getUsername(), p.getTotalPoints()));
        }

        return new PageImpl<>(rankings, pageable, profiles.getTotalElements());
    }

    public Page<RankingResponseDto> getContestLeaderboard(Long contestId, Pageable pageable) {
        Page<ContestRanking> contestRankings = rankingRepository
                .findByContestIdOrderByCurrentScoreDescPenaltyTimeAsc(contestId, pageable);

        List<RankingResponseDto> dtos = new ArrayList<>();
        int startRank = (int) pageable.getOffset() + 1;

        for (int i = 0; i < contestRankings.getContent().size(); i++) {
            ContestRanking cr = contestRankings.getContent().get(i);
            int currentRank = startRank + i;
            cr.setLocalRank(currentRank);
            dtos.add(new RankingResponseDto(currentRank, cr.getContestant().getUsername(), cr.getCurrentScore()));
        }

        return new PageImpl<>(dtos, pageable, contestRankings.getTotalElements());
    }
}