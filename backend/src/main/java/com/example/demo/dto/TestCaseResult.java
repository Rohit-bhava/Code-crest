package com.example.demo.dto;

public class TestCaseResult {
    private int testCaseNumber;
    private String status;
    private String input;
    private String expectedOutput;
    private String actualOutput;
    private String error;

    public TestCaseResult() {}

    public int getTestCaseNumber() { return testCaseNumber; }
    public void setTestCaseNumber(int testCaseNumber) { this.testCaseNumber = testCaseNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }
    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }
    public String getActualOutput() { return actualOutput; }
    public void setActualOutput(String actualOutput) { this.actualOutput = actualOutput; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
