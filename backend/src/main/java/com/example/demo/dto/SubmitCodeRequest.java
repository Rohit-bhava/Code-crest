package com.example.demo.dto;

public class SubmitCodeRequest {
    private String language;
    private String code;
    private Long contestId;

    public SubmitCodeRequest() {}

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Long getContestId() { return contestId; }
    public void setContestId(Long contestId) { this.contestId = contestId; }
}
