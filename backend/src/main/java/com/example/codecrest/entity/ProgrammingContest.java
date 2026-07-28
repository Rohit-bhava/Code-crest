package com.example.codecrest.entity;

import com.example.codecrest.enums.ContestStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "programming_contests")
public class ProgrammingContest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private ContestStatus status;

    public ProgrammingContest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ContestStatus getStatus() { return status; }
    public void setStatus(ContestStatus status) { this.status = status; }
}