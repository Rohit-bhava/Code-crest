package com.example.codecrest.entity;

import com.example.codecrest.enums.AccountStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "contestant_profiles")
public class ContestantProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    private String bio;

    private Integer totalPoints = 0;

    private Integer globalRank;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus accountStatus;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private SystemUser user;

    public ContestantProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Integer getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }

    public Integer getGlobalRank() { return globalRank; }
    public void setGlobalRank(Integer globalRank) { this.globalRank = globalRank; }

    public AccountStatus getAccountStatus() { return accountStatus; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }

    public SystemUser getUser() { return user; }
    public void setUser(SystemUser user) { this.user = user; }
}