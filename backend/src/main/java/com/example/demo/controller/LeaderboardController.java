package com.example.demo.controller;

import com.example.demo.dto.RankingResponseDto;
import com.example.demo.service.LeaderboardService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/global")
    public ResponseEntity<Page<RankingResponseDto>> getGlobal(Pageable pageable) {
        return ResponseEntity.ok(leaderboardService.getGlobalLeaderboard(pageable));
    }

    @GetMapping("/contest/{contestId}")
    public ResponseEntity<Page<RankingResponseDto>> getContestLeaderboard(@PathVariable Long contestId, Pageable pageable) {
        return ResponseEntity.ok(leaderboardService.getContestLeaderboard(contestId, pageable));
    }
}