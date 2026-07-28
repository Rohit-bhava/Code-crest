package com.example.codecrest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SubmissionRequestDto {
    @NotNull
    private Long challengeId;
    private Long contestId;
    @NotBlank
    private String sourceCode;

    public Long getChallengeId() { return challengeId; }
    public void setChallengeId(Long challengeId) { this.challengeId = challengeId; }

    public Long getContestId() { return contestId; }
    public void setContestId(Long contestId) { this.contestId = contestId; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }
}