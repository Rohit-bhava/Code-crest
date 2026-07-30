package com.example.codecrest.dto;

public class SubmissionResponseDto {
    private Long submissionId;
    private String verdict;
    private Integer pointsEarned;
    private Integer executionTimeMs;
    private String message;

    public SubmissionResponseDto() {}

    public SubmissionResponseDto(Long submissionId, String verdict, Integer pointsEarned, Integer executionTimeMs, String message) {
        this.submissionId = submissionId;
        this.verdict = verdict;
        this.pointsEarned = pointsEarned;
        this.executionTimeMs = executionTimeMs;
        this.message = message;
    }

    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }

    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }

    public Integer getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }

    public Integer getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Integer executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public static Object builder() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'builder'");
    }
}