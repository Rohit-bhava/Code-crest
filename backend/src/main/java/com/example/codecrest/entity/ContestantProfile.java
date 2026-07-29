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

    private String username;

    private String bio;

    private Integer totalPoints;

    private Integer globalRank;

    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus;

    @OneToOne
    @JoinColumn(name = "user_id")
    private SystemUser user;

}