package com.example.demo.dto;

public class RunCodeRequest {
    private String language;
    private String code;

    public RunCodeRequest() {}

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
