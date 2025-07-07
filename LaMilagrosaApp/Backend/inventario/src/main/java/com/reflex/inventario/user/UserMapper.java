package com.reflex.inventario.user;

import com.reflex.inventario.user.dto.UserReqDTO;
import com.reflex.inventario.user.dto.UserResDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResDTO toDTO(User user) {
        return UserResDTO.builder()
                .id(user.getId())
                .nombre(user.getNombre())
                .email(user.getEmail())
                .build();
    }

    public User toEntity(UserReqDTO dto) {
        return User.builder()
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                .build();
    }

    public void updateEntity(User user, UserReqDTO dto) {
        user.setNombre(dto.getNombre());
        user.setEmail(dto.getEmail());
    }
}
