package com.example.demo.dto;

import java.util.List;

public class RunCodeResponse {
    private String status;
    private int passed;
    private int total;
    private String error;
    private List<TestCaseResult> testCases;

    public RunCodeResponse() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getPassed() { return passed; }
    public void setPassed(int passed) { this.passed = passed; }
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    public List<TestCaseResult> getTestCases() { return testCases; }
    public void setTestCases(List<TestCaseResult> testCases) { this.testCases = testCases; }
}
