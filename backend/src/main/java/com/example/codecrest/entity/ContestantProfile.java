package com.example.codecrest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "contestant_profiles")
public class ContestantProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private Integer rating;

    @OneToOne
    @JoinColumn(name = "user_id")
    private SystemUser user;

    public ContestantProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public SystemUser getUser() { return user; }
    public void setUser(SystemUser user) { this.user = user; }
}