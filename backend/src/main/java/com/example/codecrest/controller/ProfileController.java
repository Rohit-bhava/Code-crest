package com.example.codecrest.controller;

import com.codecrest.entity.ContestantProfile;
import com.codecrest.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_PLATFORM_ADMIN')")
    public ResponseEntity<List<ContestantProfile>> getAllProfiles() {
        return ResponseEntity.ok(profileService.getAllProfiles());
    }

    @GetMapping("/me")
    public ResponseEntity<ContestantProfile> getMyProfile(Principal principal) {
        return ResponseEntity.ok(profileService.getProfileByUsername(principal.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateProfile(@PathVariable Long id, @RequestBody ContestantProfile profileData) {
        profileService.updateProfile(id, profileData);
        return ResponseEntity.ok("Profile updated");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_PLATFORM_ADMIN')")
    public ResponseEntity<String> deleteProfile(@PathVariable Long id) {
        profileService.deleteProfile(id);
        return ResponseEntity.ok("Profile deleted");
    }
}