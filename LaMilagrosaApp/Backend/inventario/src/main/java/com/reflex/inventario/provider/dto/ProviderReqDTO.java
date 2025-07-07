package com.reflex.inventario.provider.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProviderReqDTO {
    @NotBlank(message = "El nombre del proveedor no puede estar vacío")
    private String name;

    @NotNull(message = "El teléfono no puede estar vacío")
    @PositiveOrZero(message = "El teléfono debe ser mayor o igual a 0")
    private Long phone;

    @NotBlank(message = "La dirección del proveedor no puede estar vacía")
    private String address;

    @NotBlank(message = "El email del proveedor no puede estar vacío")
    @Email(message ="El email debe ser válido")
    private String email;

}
