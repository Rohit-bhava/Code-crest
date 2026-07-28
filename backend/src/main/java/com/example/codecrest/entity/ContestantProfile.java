package com.example.codecrest.entity;

import com.example.codecrest.enums.AccountStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contestant_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestantProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    private String bio;

    @Builder.Default
    private Integer totalPoints = 0;

    private Integer globalRank;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus accountStatus;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private SystemUser user;
}