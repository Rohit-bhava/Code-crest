package com.example.codecrest.service;

import com.example.codecrest.dto.ChallengeCreationDto;
import com.example.codecrest.entity.CodingChallenge;
import com.example.codecrest.entity.SystemUser;
import com.example.codecrest.exception.ResourceNotFoundException;
import com.example.codecrest.repository.CodingChallengeRepository;
import com.example.codecrest.repository.SystemUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChallengeService {

    @Autowired
    private CodingChallengeRepository challengeRepository;
    @Autowired
    private SystemUserRepository userRepository;

    public List<CodingChallenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    public Page<CodingChallenge> getAllChallengesPaged(Pageable pageable) {
        return challengeRepository.findAll(pageable);
    }

    public CodingChallenge getChallengeById(Long id) {
        return challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + id));
    }

    public void createChallenge(ChallengeCreationDto dto, String username) {
        SystemUser setter = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Setter user not found"));

        CodingChallenge challenge = ((Object) CodingChallenge.builder())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .difficulty(dto.getDifficulty())
                .basePoints(dto.getBasePoints())
                .timeLimitMs(dto.getTimeLimitMs())
                .setter(setter)
                .build();

        challengeRepository.save(challenge);
    }

    public void updateChallenge(Long id, ChallengeCreationDto dto) {
        CodingChallenge challenge = getChallengeById(id);
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