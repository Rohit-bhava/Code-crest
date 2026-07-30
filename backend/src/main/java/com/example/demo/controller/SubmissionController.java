package com.example.codecrest.controller;

import com.example.codecrest.entity.ChallengeSubmission;
import com.example.codecrest.entity.ContestantProfile;
import com.example.codecrest.exception.ResourceNotFoundException;
import com.example.codecrest.repository.ContestantProfileRepository;
import com.example.codecrest.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private ContestantProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<Page<ChallengeSubmission>> getAllSubmissions(Pageable pageable) {
        return ResponseEntity.ok(submissionService.getAllSubmissions(pageable));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ROLE_CONTESTANT')")
    public ResponseEntity<List<ChallengeSubmission>> getMySubmissions(Principal principal) {
        ContestantProfile profile = profileRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        return ResponseEntity.ok(submissionService.getSubmissionsByContestant(profile.getId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_PLATFORM_ADMIN')")
    public ResponseEntity<String> deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
        return ResponseEntity.ok("Submission deleted");
    }
}