package com.example.codecrest.controller;

import com.example.codecrest.dto.RankingResponseDto;
import com.example.codecrest.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/global")
    public ResponseEntity<Page<RankingResponseDto>> getGlobalLeaderboard(Pageable pageable) {
        return ResponseEntity.ok(leaderboardService.getGlobalLeaderboard(pageable));
    }

    @GetMapping("/contest/{contestId}")
    public ResponseEntity<Page<RankingResponseDto>> getContestLeaderboard(@PathVariable Long contestId, Pageable pageable) {
        return ResponseEntity.ok(leaderboardService.getContestLeaderboard(contestId, pageable));
    }
}