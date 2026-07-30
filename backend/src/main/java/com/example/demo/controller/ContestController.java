package com.example.demo.controller;

import com.example.demo.entity.ProgrammingContest;
import com.example.demo.repository.ProgrammingContestRepository;
import com.example.demo.service.ContestService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/contests")
public class ContestController {

    private final ContestService contestService;
    private final ProgrammingContestRepository contestRepository;

    public ContestController(ContestService contestService,
                              ProgrammingContestRepository contestRepository) {
        this.contestService = contestService;
        this.contestRepository = contestRepository;
    }

    @GetMapping
    public ResponseEntity<Page<ProgrammingContest>> getAllContests(Pageable pageable) {
        return ResponseEntity.ok(contestRepository.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgrammingContest> getById(@PathVariable Long id) {
        return ResponseEntity.ok(contestService.getContestById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<String> create(@RequestBody ProgrammingContest contest) {
        contestService.createContest(contest);
        return ResponseEntity.ok("Contest created");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody ProgrammingContest contest) {
        contestService.updateContest(id, contest);
        return ResponseEntity.ok("Contest updated");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        contestService.deleteContest(id);
        return ResponseEntity.ok("Contest deleted");
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<String> enroll(@PathVariable Long id, Principal principal) {
        contestService.enrollParticipant(id, principal.getName());
        return ResponseEntity.ok("Enrolled successfully");
    }
}