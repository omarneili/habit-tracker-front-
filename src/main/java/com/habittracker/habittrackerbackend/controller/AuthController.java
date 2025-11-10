package com.habittracker.habittrackerbackend.controller;

import com.habittracker.habittrackerbackend.model.User;
import com.habittracker.habittrackerbackend.payload.LoginRequest;
import com.habittracker.habittrackerbackend.payload.JwtAuthenticationResponse;
import com.habittracker.habittrackerbackend.payload.RegisterRequest;
import com.habittracker.habittrackerbackend.security.JwtTokenProvider;
import com.habittracker.habittrackerbackend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthenticationManager authenticationManager, AuthService authService, JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.authService = authService;
        this.tokenProvider = tokenProvider;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = authService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, user.getEmail(), user.getRole().name()));
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = authService.registerUser(registerRequest.getNom(), registerRequest.getPrenom(), registerRequest.getEmail(), registerRequest.getPassword());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, user.getEmail(), user.getRole().name()));
    }
}
