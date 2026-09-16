package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.CodingChallenge;
import com.example.demo.repository.CodingChallengeRepository;
import com.example.demo.service.ChallengeRunService;
import com.example.demo.service.ChallengeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;
    private final CodingChallengeRepository challengeRepository;
    private final ChallengeRunService challengeRunService;

    public ChallengeController(ChallengeService challengeService,
                                CodingChallengeRepository challengeRepository,
                                ChallengeRunService challengeRunService) {
        this.challengeService = challengeService;
        this.challengeRepository = challengeRepository;
        this.challengeRunService = challengeRunService;
    }

    @GetMapping
    public ResponseEntity<Page<CodingChallenge>> getAll(Pageable pageable) {
        return ResponseEntity.ok(challengeRepository.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CodingChallenge> getById(@PathVariable Long id) {
        return ResponseEntity.ok(challengeService.getChallengeById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> create(@RequestBody ChallengeCreationDto dto, Principal principal) {
        challengeService.createChallenge(dto, principal.getName());
        return ResponseEntity.ok("Challenge created");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody ChallengeCreationDto dto, Principal principal) {
        challengeService.updateChallenge(id, dto, principal.getName());
        return ResponseEntity.ok("Challenge updated");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        challengeService.deleteChallenge(id);
        return ResponseEntity.ok("Challenge deleted");
    }

    // RUN — visible test cases only, no submission saved
    @PostMapping("/{id}/run")
    @PreAuthorize("hasRole('CONTESTANT')")
    public ResponseEntity<RunCodeResponse> run(@PathVariable Long id,
                                                @RequestBody RunCodeRequest req) {
        return ResponseEntity.ok(challengeRunService.run(id, req));
    }

    // SUBMIT — all test cases, saves submission, awards points
    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('CONTESTANT')")
    public ResponseEntity<SubmitCodeResponse> submit(@PathVariable Long id,
                                                      @RequestBody SubmitCodeRequest req,
                                                      Principal principal) {
        return ResponseEntity.ok(challengeRunService.submit(id, req, principal.getName()));
    }

    // Legacy submit endpoint for compatibility
    @PostMapping("/{id}/submit-legacy")
    @PreAuthorize("hasRole('CONTESTANT')")
    public ResponseEntity<String> submit(@PathVariable Long id,
                                         @RequestBody SubmissionRequestDto req,
                                         Principal principal) {
        return ResponseEntity.ok("submitted");
    }
}
