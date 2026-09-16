package com.example.demo.controller;

import com.example.demo.entity.ContestantProfile;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ContestantProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ContestantProfileRepository profileRepository;

    public ProfileController(ContestantProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContestantProfile>> getAll() {
        return ResponseEntity.ok(profileRepository.findAll());
    }

    @GetMapping("/me")
    public ResponseEntity<ContestantProfile> getMe(Principal principal) {
        ContestantProfile profile = profileRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<String> updateMe(Principal principal, @RequestBody ContestantProfile profile) {
        ContestantProfile existing = profileRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));
        existing.setBio(profile.getBio());
        profileRepository.save(existing);
        return ResponseEntity.ok("Profile updated");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody ContestantProfile profile) {
        ContestantProfile existing = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
        existing.setBio(profile.getBio());
        if (profile.getUsername() != null) {
            existing.setUsername(profile.getUsername());
        }
        profileRepository.save(existing);
        return ResponseEntity.ok("Profile updated");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        ContestantProfile existing = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
        profileRepository.delete(existing);
        return ResponseEntity.ok("Profile deleted");
    }
}