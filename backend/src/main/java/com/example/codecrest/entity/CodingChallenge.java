package com.example.codecrest.entity;

import com.example.codecrest.enums.Difficulty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "coding_challenges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodingChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(nullable = false)
    private Integer basePoints;

    @Column(nullable = false)
    private Integer timeLimitMs;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private SystemUser setter;
}