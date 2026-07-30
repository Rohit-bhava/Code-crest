package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.dto.UserDto;
import com.example.demo.entity.ContestantProfile;
import com.example.demo.entity.SystemUser;
import com.example.demo.enums.AccountStatus;
import com.example.demo.enums.UserRole;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.repository.ContestantProfileRepository;
import com.example.demo.repository.SystemUserRepository;
import com.example.demo.security.JwtUtil;

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

        if (userRepository.existsById(dto.getUsername())) {
            throw new BusinessValidationException(
                    "Username already exists!");
        }

        SystemUser user = new SystemUser();
        user.setUsername(dto.getUsername());
        user.setPassword(
                passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.ROLE_CONTESTANT);

        user = userRepository.save(user);

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
                new UsernamePasswordAuthenticationToken(
                        dto.getUsername(),
                        dto.getPassword())
        );

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(
                        dto.getUsername());

        String token =
                jwtUtil.generateToken(userDetails);

        SystemUser user =
                userRepository.findByUsername(
                                dto.getUsername())
                        .orElseThrow(() ->
                                new BusinessValidationException(
                                        "User not found"));

        UserDto userDto = new UserDto(
                user.getId(),
                user.getUsername(),
                user.getRole()
        );

        return new AuthResponseDto(
                token,
                userDto
        );
    }
}