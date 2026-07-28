package com.codecrest.controller;

import com.codecrest.dto.RankingResponseDto;
import com.codecrest.service.LeaderboardService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/global")
    public ResponseEntity<Page<RankingResponseDto>> getGlobalLeaderboard(Pageable pageable) {
        return ResponseEntity.ok(leaderboardService.getGlobalLeaderboard(pageable));
    }

    @GetMapping("/contest/{contestId}")
    public ResponseEntity<Page<RankingResponseDto>> getContestLeaderboard(@PathVariable Long contestId, Pageable pageable) {
        return ResponseEntity.ok(leaderboardService.getContestLeaderboard(contestId, pageable));
    }
}