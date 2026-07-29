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

    private String title;

    @Column(length = 3000)
    private String description;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    private Integer basePoints;

    private Integer timeLimitMs;

    @ManyToOne
    @JoinColumn(name = "setter_id")
    private SystemUser setter;

}