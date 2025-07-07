package com.reflex.inventario.order.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderReqDTO {
    @NotNull(message = "La fecha no puede estar vacía")
    private LocalDate date;

    @NotNull(message = "El valor del IVA no puede estar vacío")
    @PositiveOrZero(message = "El valor del IVA debe ser mayor o igual a 0")
    private Integer IVA;


    @NotNull(message = "La fecha de vencimiento no puede estar vacía")
    @Future(message = "La fecha de vencimiento debe ser en el futuro")
    private LocalDate expirationDate;

    private Set<ProductDetailDTO> productsDetails;
}
