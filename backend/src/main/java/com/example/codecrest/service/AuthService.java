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

        SystemUser user = new SystemUser();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.ROLE_CONTESTANT);

        ContestantProfile profile = new ContestantProfile();
        profile.setUsername(dto.getUsername());
        profile.setBio(dto.getBio());
        profile.setAccountStatus(AccountStatus.ACTIVE);
        profile.setUser(user);
        profile.setTotalPoints(0);

        profileRepository.save(profile);
    }

    public AuthResponseDto login(AuthRequestDto dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(dto.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        SystemUser user = userRepository.findByUsername(dto.getUsername()).orElseThrow();
        
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setRole(user.getRole());

        AuthResponseDto response = new AuthResponseDto();
        response.setToken(token);
        response.setUser(userDto);

        return response;
    }
}