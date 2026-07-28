package com.example.codecrest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "challenge_submissions")
public class ChallengeSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private SystemUser user;

    public ChallengeSubmission() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public SystemUser getUser() { return user; }
    public void setUser(SystemUser user) { this.user = user; }
}