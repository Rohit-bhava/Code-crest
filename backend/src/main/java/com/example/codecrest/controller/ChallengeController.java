package com.example.codecrest.controller;

import com.example.codecrest.dto.*;
import com.example.codecrest.entity.CodingChallenge;
import com.example.codecrest.service.ChallengeService;
import com.example.codecrest.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    @Autowired
    private SubmissionService submissionService;

    @GetMapping
    public ResponseEntity<Page<CodingChallenge>> getAllChallenges(Pageable pageable) {
        return ResponseEntity.ok(challengeService.getAllChallengesPaged(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CodingChallenge> getChallengeById(@PathVariable Long id) {
        return ResponseEntity.ok(challengeService.getChallengeById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_PROBLEM_SETTER', 'ROLE_PLATFORM_ADMIN')")
    public ResponseEntity<String> createChallenge(@Valid @RequestBody ChallengeCreationDto dto, Principal principal) {
        challengeService.createChallenge(dto, principal.getName());
        return ResponseEntity.ok("Challenge created");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_PROBLEM_SETTER', 'ROLE_PLATFORM_ADMIN')")
    public ResponseEntity<String> updateChallenge(@PathVariable Long id, @Valid @RequestBody ChallengeCreationDto dto) {
        challengeService.updateChallenge(id, dto);
        return ResponseEntity.ok("Challenge updated");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_PLATFORM_ADMIN')")
    public ResponseEntity<String> deleteChallenge(@PathVariable Long id) {
        challengeService.deleteChallenge(id);
        return ResponseEntity.ok("Challenge deleted");
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('ROLE_CONTESTANT')")
    public ResponseEntity<SubmissionResponseDto> submitChallenge(
            @PathVariable Long id,
            @Valid @RequestBody SubmissionRequestDto dto,
            Principal principal) {
        dto.setChallengeId(id);
        return ResponseEntity.ok(submissionService.processSubmission(dto, principal.getName()));
    }
}