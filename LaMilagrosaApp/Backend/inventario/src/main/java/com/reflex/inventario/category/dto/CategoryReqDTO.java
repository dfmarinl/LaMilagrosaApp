package com.reflex.inventario.category.dto;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryReqDTO {
    @NotNull(message = "El nombre no puede estár vacío")
    private String name;
    private String description;
}
