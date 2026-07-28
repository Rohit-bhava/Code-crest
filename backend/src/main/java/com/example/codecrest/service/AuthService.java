package com.example.codecrest.service;

import com.example.codecrest.dto.*;
import com.example.codecrest.entity.*;
import com.example.codecrest.enums.AccountStatus;
import com.example.codecrest.enums.UserRole;
import com.example.codecrest.exception.BusinessValidationException;
import com.example.codecrest.repository.ContestantProfileRepository;
import com.example.codecrest.repository.SystemUserRepository;
import com.example.codecrest.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private SystemUserRepository userRepository;
    @Autowired
    private ContestantProfileRepository profileRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserDetailsService userDetailsService;

    public void register(RegisterDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new BusinessValidationException("Username already exists!");
        }

        SystemUser user = SystemUser.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(UserRole.ROLE_CONTESTANT)
                .build();

        ContestantProfile profile = ContestantProfile.builder()
                .username(dto.getUsername())
                .bio(dto.getBio())
                .accountStatus(AccountStatus.ACTIVE)
                .user(user)
                .totalPoints(0)
                .build();

        profileRepository.save(profile);
    }

    public AuthResponseDto login(AuthRequestDto dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(dto.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        SystemUser user = userRepository.findByUsername(dto.getUsername()).orElseThrow();
        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .build();

        return AuthResponseDto.builder()
                .token(token)
                .user(userDto)
                .build();
    }
}