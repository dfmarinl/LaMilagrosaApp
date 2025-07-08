package com.reflex.inventario.user.dto;

import com.reflex.inventario.role.RoleName;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Set;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResDTO {
    private Integer id;
    private String nombre;
    private String email;
    private Set<RoleName> roles;
}
