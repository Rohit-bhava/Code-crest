package com.example.codecrest.service;

import com.example.codecrest.dto.RankingResponseDto;
import com.example.codecrest.entity.ContestRanking;
import com.example.codecrest.entity.ContestantProfile;
import com.example.codecrest.repository.ContestRankingRepository;
import com.example.codecrest.repository.ContestantProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class LeaderboardService {

    @Autowired
    private ContestantProfileRepository profileRepository;
    @Autowired
    private ContestRankingRepository rankingRepository;

    public Page<RankingResponseDto> getGlobalLeaderboard(Pageable pageable) {
        Page<ContestantProfile> profiles = profileRepository.findAllByOrderByTotalPointsDesc(pageable);
        AtomicInteger rankCounter = new AtomicInteger((int) pageable.getOffset() + 1);

        List<RankingResponseDto> rankingDtos = profiles.stream().map(profile -> {
            RankingResponseDto dto = RankingResponseDto.builder()
                    .rank(rankCounter.getAndIncrement())
                    .username(profile.getUsername())
                    .score(profile.getTotalPoints())
                    .build();
            profile.setGlobalRank(dto.getRank());
            profileRepository.save(profile);
            return dto;
        }).toList();

        return new PageImpl<>(rankingDtos, pageable, profiles.getTotalElements());
    }

    public Page<RankingResponseDto> getContestLeaderboard(Long contestId, Pageable pageable) {
        Page<ContestRanking> rankings = rankingRepository.findByContestIdOrderByCurrentScoreDescPenaltyTimeAsc(contestId, pageable);
        AtomicInteger rankCounter = new AtomicInteger((int) pageable.getOffset() + 1);

        List<RankingResponseDto> rankingDtos = rankings.stream().map(ranking -> {
            int rank = rankCounter.getAndIncrement();
            ranking.setLocalRank(rank);
            rankingRepository.save(ranking);

            return RankingResponseDto.builder()
                    .rank(rank)
                    .username(ranking.getContestant().getUsername())
                    .score(ranking.getCurrentScore())
                    .build();
        }).toList();

        return new PageImpl<>(rankingDtos, pageable, rankings.getTotalElements());
    }
}