package com.reflex.inventario.product.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Set;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductReqDTO {
    @NotBlank(message = "El nombre del producto no puede estar vacío")
    private String name;
    private String description;
    @NotNull(message = "El precio del producto no puede estar vacío")
    @PositiveOrZero(message = "El precio debe ser mayor o igual a 0")
    private Float price;
    private String image;

    private Integer categoryId;

}
