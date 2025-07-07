package com.reflex.inventario.user.service.impl;

import com.reflex.inventario.role.Role;
import com.reflex.inventario.role.RoleName;
import com.reflex.inventario.role.RoleRepository;
import com.reflex.inventario.user.User;
import com.reflex.inventario.user.UserMapper;
import com.reflex.inventario.user.UserRepository;
import com.reflex.inventario.user.dto.UserReqDTO;
import com.reflex.inventario.user.dto.UserResDTO;
import com.reflex.inventario.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;

    @Override
    public List<UserResDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserResDTO getUserById(Integer id) {
        return userMapper.toDTO(userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado")));
    }

    @Override
    public UserResDTO updateUser(Integer id, UserReqDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        userMapper.updateEntity(user, dto);
        return userMapper.toDTO(userRepository.save(user));
    }

    @Override
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserResDTO assignAdminRole(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                .orElseThrow(() -> new EntityNotFoundException("Rol ADMIN no existe"));

        Set<Role> roles = user.getRoles();
        roles.add(adminRole);
        user.setRoles(roles);

        return userMapper.toDTO(userRepository.save(user));
    }
}
