package com.example.demo.service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.dto.UserDto;
import com.example.demo.entity.AccountStatus;
import com.example.demo.entity.ContestantProfile;
import com.example.demo.entity.SystemUser;
import com.example.demo.entity.UserRole;
import com.example.demo.repository.ContestantProfileRepository;
import com.example.demo.repository.SystemUserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final SystemUserRepository systemUserRepository;
    private final ContestantProfileRepository contestantProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(SystemUserRepository systemUserRepository,
                        ContestantProfileRepository contestantProfileRepository,
                        PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager,
                        JwtUtil jwtUtil) {
        this.systemUserRepository = systemUserRepository;
        this.contestantProfileRepository = contestantProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public void register(RegisterDto dto) {
        if (systemUserRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        SystemUser user = new SystemUser();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.CONTESTANT);
        systemUserRepository.save(user);

        ContestantProfile profile = new ContestantProfile();
        profile.setUsername(dto.getUsername());
        profile.setBio(dto.getBio());
        profile.setTotalPoints(0);
        profile.setAccountStatus(AccountStatus.ACTIVE);
        profile.setUser(user);
        contestantProfileRepository.save(profile);
    }

    public AuthResponseDto login(AuthRequestDto dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword()));

        SystemUser user = systemUserRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = new User(user.getUsername(), user.getPassword(),
                List.of(() -> "ROLE_" + user.getRole().name()));

        String token = jwtUtil.generateToken(userDetails);
        UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getRole());

        return new AuthResponseDto(token, userDto);
    }
}