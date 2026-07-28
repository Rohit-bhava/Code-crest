package com.codecrest.service;

import com.codecrest.entity.ContestantProfile;
import com.codecrest.exception.ResourceNotFoundException;
import com.codecrest.repository.ContestantProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {

    private final ContestantProfileRepository profileRepository;

    public ProfileService(ContestantProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public List<ContestantProfile> getAllProfiles() {
        return profileRepository.findAll();
    }

    public ContestantProfile getProfileByUsername(String username) {
        return profileRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for username: " + username));
    }

    public ContestantProfile getProfileById(Long id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
    }

    public void updateProfile(Long id, ContestantProfile updatedData) {
        ContestantProfile profile = getProfileById(id);
        profile.setBio(updatedData.getBio());
        if (updatedData.getAccountStatus() != null) {
            profile.setAccountStatus(updatedData.getAccountStatus());
        }
        profileRepository.save(profile);
    }

    public void deleteProfile(Long id) {
        ContestantProfile profile = getProfileById(id);
        profileRepository.delete(profile);
    }
}