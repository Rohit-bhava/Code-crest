package com.example.codecrest.entity;

import com.example.codecrest.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
}