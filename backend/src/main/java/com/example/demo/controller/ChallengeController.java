package com.example.demo.controller;

import com.example.demo.dto.ChallengeCreationDto;
import com.example.demo.dto.SubmissionRequestDto;
import com.example.demo.dto.SubmissionResponseDto;
import com.example.demo.entity.CodingChallenge;
import com.example.demo.repository.CodingChallengeRepository;
import com.example.demo.service.ChallengeService;
import com.example.demo.service.SubmissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;
    private final CodingChallengeRepository challengeRepository;
    private final SubmissionService submissionService;

    public ChallengeController(ChallengeService challengeService,
                                CodingChallengeRepository challengeRepository,
                                SubmissionService submissionService) {
        this.challengeService = challengeService;
        this.challengeRepository = challengeRepository;
        this.submissionService = submissionService;
    }

    @GetMapping
    public ResponseEntity<List<CodingChallenge>> getAll() {
        return ResponseEntity.ok(challengeRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CodingChallenge> getById(@PathVariable Long id) {
        return ResponseEntity.ok(challengeService.getChallengeById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROBLEM_SETTER','PLATFORM_ADMIN')")
    public ResponseEntity<String> create(@RequestBody ChallengeCreationDto dto, Principal principal) {
        challengeService.createChallenge(dto, principal.getName());
        return ResponseEntity.ok("Challenge created");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROBLEM_SETTER','PLATFORM_ADMIN')")
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody ChallengeCreationDto dto) {
        challengeService.updateChallenge(id, dto);
        return ResponseEntity.ok("Challenge updated");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        challengeService.deleteChallenge(id);
        return ResponseEntity.ok("Challenge deleted");
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('CONTESTANT')")
    public ResponseEntity<SubmissionResponseDto> submit(@PathVariable Long id,
                                                          @RequestBody SubmissionRequestDto dto,
                                                          Principal principal) {
        dto.setChallengeId(id);
        SubmissionResponseDto response = submissionService.processSubmission(dto, principal.getName());
        return ResponseEntity.ok(response);
    }
}