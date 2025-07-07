package com.reflex.inventario.user.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserReqDTO {
    @NotBlank(message = "El nombre del producto no puede estar vacío")
    private String nombre;
    @Email(message = "EL email debe ser válido")
    @NotBlank(message = "El email es mandatorio")
    @NotEmpty(message = "El email es mandatorio")
    private String email;
}
