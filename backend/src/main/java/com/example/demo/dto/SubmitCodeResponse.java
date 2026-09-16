package com.example.demo.dto;

public class SubmitCodeResponse {
    private String status;
    private String message;
    private int passed;
    private int total;
    private Integer executionTime;
    private Integer pointsEarned;
    private Long submissionId;

    public SubmitCodeResponse() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public int getPassed() { return passed; }
    public void setPassed(int passed) { this.passed = passed; }
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
    public Integer getExecutionTime() { return executionTime; }
    public void setExecutionTime(Integer executionTime) { this.executionTime = executionTime; }
    public Integer getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }
    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }
}
