package com.example.demo.service;

import com.example.demo.dto.ChallengeCreationDto;
import com.example.demo.entity.CodingChallenge;
import com.example.demo.entity.SystemUser;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CodingChallengeRepository;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.stereotype.Service;

@Service
public class ChallengeService {

    private final CodingChallengeRepository challengeRepository;
    private final SystemUserRepository systemUserRepository;

    public ChallengeService(CodingChallengeRepository challengeRepository,
                             SystemUserRepository systemUserRepository) {
        this.challengeRepository = challengeRepository;
        this.systemUserRepository = systemUserRepository;
    }

    public CodingChallenge getChallengeById(Long id) {
        return challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + id));
    }

    public void createChallenge(ChallengeCreationDto dto, String username) {
        SystemUser setter = systemUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        CodingChallenge challenge = new CodingChallenge();
        mapDto(challenge, dto);
        challenge.setSetter(setter);
        challengeRepository.save(challenge);
    }

    public void updateChallenge(Long id, ChallengeCreationDto dto, String username) {
        CodingChallenge challenge = getChallengeById(id);
        mapDto(challenge, dto);
        challengeRepository.save(challenge);
    }

    public void deleteChallenge(Long id) {
        challengeRepository.delete(getChallengeById(id));
    }

    private void mapDto(CodingChallenge c, ChallengeCreationDto dto) {
        c.setTitle(dto.getTitle());
        c.setDescription(dto.getDescription());
        c.setInputFormat(dto.getInputFormat());
        c.setOutputFormat(dto.getOutputFormat());
        c.setConstraints(dto.getConstraints());
        c.setSampleInput(dto.getSampleInput());
        c.setSampleOutput(dto.getSampleOutput());
        c.setDifficulty(dto.getDifficulty());
        c.setBasePoints(dto.getBasePoints());
        c.setTimeLimitMs(dto.getTimeLimitMs());
    }
}
