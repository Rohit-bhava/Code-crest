package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "challenge_test_cases")
public class ChallengeTestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    @JsonBackReference
    private CodingChallenge challenge;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String input;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;

    private boolean hidden = false;

    private Integer testCaseOrder = 0;

    public ChallengeTestCase() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public CodingChallenge getChallenge() { return challenge; }
    public void setChallenge(CodingChallenge challenge) { this.challenge = challenge; }
    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }
    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }
    public boolean isHidden() { return hidden; }
    public void setHidden(boolean hidden) { this.hidden = hidden; }
    public Integer getTestCaseOrder() { return testCaseOrder; }
    public void setTestCaseOrder(Integer testCaseOrder) { this.testCaseOrder = testCaseOrder; }
}
