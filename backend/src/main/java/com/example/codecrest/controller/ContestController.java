package com.example.codecrest.controller;

import com.example.codecrest.entity.ProgrammingContest;
import com.example.codecrest.service.ContestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/contests")
public class ContestController {

    @Autowired
    private ContestService contestService;

    @GetMapping
    public ResponseEntity<Page<ProgrammingContest>> getAllContests(Pageable pageable) {
        return ResponseEntity.ok(contestService.getAllContestsPaged(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgrammingContest> getContestById(@PathVariable Long id) {
        return ResponseEntity.ok(contestService.getContestById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_PLATFORM_ADMIN')")
    public ResponseEntity<String> createContest(@Valid @RequestBody ProgrammingContest contest) {
        contestService.createContest(contest);
        return ResponseEntity.ok("Contest created");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_PLATFORM_ADMIN')")
    public ResponseEntity<String> updateContest(@PathVariable Long id, @Valid @RequestBody ProgrammingContest contest) {
        contestService.updateContest(id, contest);
        return ResponseEntity.ok("Contest updated");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_PLATFORM_ADMIN')")
    public ResponseEntity<String> deleteContest(@PathVariable Long id) {
        contestService.deleteContest(id);
        return ResponseEntity.ok("Contest deleted");
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<String> enrollParticipant(@PathVariable Long id, Principal principal) {
        contestService.enrollParticipant(id, principal.getName());
        return ResponseEntity.ok("Successfully enrolled in contest");
    }
}