package com.reflex.inventario.auth;


import com.reflex.inventario.role.RoleName;
import com.reflex.inventario.role.RoleRepository;
import com.reflex.inventario.security.JwtService;
import com.reflex.inventario.user.Token;
import com.reflex.inventario.user.TokenRepository;
import com.reflex.inventario.user.User;
import com.reflex.inventario.user.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    private String activationUrl;

    public void register(RegistrationRequest request)  {
        //1. Asign a role by default (USER)
        //2. Create and save an user obj
        //3. Send a validation email
        var userRole = roleRepository.findByName(RoleName.EMPLOYEE)
                .orElseThrow(() -> new IllegalStateException("Role EMPLOYEE was not initialized"));
        var user = User.builder()
                .email(request.getEmail())
                //Is needed to encode the password
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(userRole))
                .build();
        userRepository.save(user);
      //  sendValidationEmail(user);
    }


    private String generateAndSaveActivationToken(User user) {
        //1 Generate a token
        String generateToken = generateActivationToken(6);
        var token = Token.builder()
                .token(generateToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);
        return generateToken;
    }

    private String generateActivationToken(int length) {
        //generate a token compose of length digits
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        //make sure that the random value is cryptographicly secure
        SecureRandom secureRandom = new SecureRandom();
        for(int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length()); // 0 .. 9
            codeBuilder.append(characters.charAt(randomIndex));
        }
        return codeBuilder.toString();

    }

    public AuthenticationResponse authenticate(@Valid AuthenticationResquest request) {
        //THis method will take care about all the authentication process
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var claims = new HashMap<String, Object>();
        var user = ((User)auth.getPrincipal());

        var jwtToken = jwtService.generateToken(claims, user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();

    }


}
