package com.example.demo.service;

import com.example.demo.dto.ChallengeCreationDto;
import com.example.demo.entity.CodingChallenge;
import com.example.demo.entity.SystemUser;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CodingChallengeRepository;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChallengeService {

    private final CodingChallengeRepository challengeRepository;
    private final SystemUserRepository systemUserRepository;

    public ChallengeService(CodingChallengeRepository challengeRepository,
                             SystemUserRepository systemUserRepository) {
        this.challengeRepository = challengeRepository;
        this.systemUserRepository = systemUserRepository;
    }

    public List<CodingChallenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    public CodingChallenge getChallengeById(Long id) {
        return challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + id));
    }

    public void createChallenge(ChallengeCreationDto dto, String username) {
        SystemUser setter = systemUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        CodingChallenge challenge = new CodingChallenge();
        challenge.setTitle(dto.getTitle());
        challenge.setDescription(dto.getDescription());
        challenge.setDifficulty(dto.getDifficulty());
        challenge.setBasePoints(dto.getBasePoints());
        challenge.setTimeLimitMs(dto.getTimeLimitMs());
        challenge.setSetter(setter);
        challengeRepository.save(challenge);
    }

    public void updateChallenge(Long id, ChallengeCreationDto dto, String username) {
        CodingChallenge challenge = getChallengeById(id);
        SystemUser requester = systemUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        if (requester.getRole() == com.example.demo.entity.UserRole.PROBLEM_SETTER) {
            if (challenge.getSetter() == null || !challenge.getSetter().getUsername().equals(username)) {
                throw new com.example.demo.exception.BusinessValidationException(
                        "You can only edit challenges you created");
            }
        }
        challenge.setTitle(dto.getTitle());
        challenge.setDescription(dto.getDescription());
        challenge.setDifficulty(dto.getDifficulty());
        challenge.setBasePoints(dto.getBasePoints());
        challenge.setTimeLimitMs(dto.getTimeLimitMs());
        challengeRepository.save(challenge);
    }

    public void deleteChallenge(Long id) {
        CodingChallenge challenge = getChallengeById(id);
        challengeRepository.delete(challenge);
    }
}