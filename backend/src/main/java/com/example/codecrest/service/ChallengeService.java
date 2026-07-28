package com.example.codecrest.service;

import com.codecrest.dto.AuthRequestDto;
import com.codecrest.dto.AuthResponseDto;
import com.codecrest.dto.RegisterDto;
import com.codecrest.dto.UserDto;
import com.codecrest.entity.ContestantProfile;
import com.codecrest.entity.SystemUser;
import com.codecrest.enums.AccountStatus;
import com.codecrest.enums.UserRole;
import com.codecrest.exception.BusinessValidationException;
import com.codecrest.repository.ContestantProfileRepository;
import com.codecrest.repository.SystemUserRepository;
import com.codecrest.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final SystemUserRepository userRepository;
    private final ContestantProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public AuthService(SystemUserRepository userRepository,
                       ContestantProfileRepository profileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil,
                       UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Transactional
    public void register(RegisterDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new BusinessValidationException("Username is already taken");
        }

        SystemUser user = new SystemUser();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.ROLE_CONTESTANT);
        user = userRepository.save(user);

        ContestantProfile profile = new ContestantProfile();
        profile.setUsername(user.getUsername());
        profile.setBio(dto.getBio());
        profile.setUser(user);
        profile.setAccountStatus(AccountStatus.ACTIVE);
        profileRepository.save(profile);
    }

    public AuthResponseDto login(AuthRequestDto dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(dto.getUsername());
        SystemUser user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new BusinessValidationException("User not found"));

        String token = jwtUtil.generateToken(userDetails);
        UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getRole().name());

        return new AuthResponseDto(token, userDto);
    }
}