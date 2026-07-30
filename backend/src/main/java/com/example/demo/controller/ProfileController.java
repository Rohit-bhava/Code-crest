package com.example.codecrest.controller;

import com.example.codecrest.entity.ContestantProfile;
import com.example.codecrest.exception.ResourceNotFoundException;
import com.example.codecrest.repository.ContestantProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ContestantProfileRepository profileRepository;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_PLATFORM_ADMIN')")
    public ResponseEntity<List<ContestantProfile>> getAllProfiles() {
        return ResponseEntity.ok(profileRepository.findAll());
    }

    @GetMapping("/me")
    public ResponseEntity<ContestantProfile> getMyProfile(Principal principal) {
        ContestantProfile profile = profileRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateProfile(@PathVariable Long id, @RequestBody ContestantProfile updatedData) {
        ContestantProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        profile.setBio(updatedData.getBio());
        profileRepository.save(profile);
        return ResponseEntity.ok("Profile updated");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_PLATFORM_ADMIN')")
    public ResponseEntity<String> deleteProfile(@PathVariable Long id) {
        ContestantProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        profileRepository.delete(profile);
        return ResponseEntity.ok("Profile deleted");
    }
}