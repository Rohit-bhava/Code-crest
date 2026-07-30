package com.example.demo.controller;

import com.example.demo.entity.ChallengeSubmission;
import com.example.demo.entity.ContestantProfile;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ChallengeSubmissionRepository;
import com.example.demo.repository.ContestantProfileRepository;
import com.example.demo.service.SubmissionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final ChallengeSubmissionRepository submissionRepository;
    private final ContestantProfileRepository profileRepository;
    private final SubmissionService submissionService;

    public SubmissionController(ChallengeSubmissionRepository submissionRepository,
                                 ContestantProfileRepository profileRepository,
                                 SubmissionService submissionService) {
        this.submissionRepository = submissionRepository;
        this.profileRepository = profileRepository;
        this.submissionService = submissionService;
    }

    @GetMapping
    public ResponseEntity<Page<ChallengeSubmission>> getAll(Pageable pageable) {
        return ResponseEntity.ok(submissionRepository.findAll(pageable));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CONTESTANT')")
    public ResponseEntity<List<ChallengeSubmission>> getMy(Principal principal) {
        ContestantProfile profile = profileRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));
        return ResponseEntity.ok(submissionRepository.findByContestantId(profile.getId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
        return ResponseEntity.ok("Submission deleted");
    }
}