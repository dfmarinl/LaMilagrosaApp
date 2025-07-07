package com.reflex.inventario.productInventory.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductInventoryReqDTO {
    @NotNull(message = "El stock del producto no puede estar vacío")
    @PositiveOrZero(message = "El stock debe ser mayor o igual a 0")
    private Integer stock;

    @NotNull(message = "El número de lote no puede estar vacío")
    @Positive(message = "El número de lote debe ser mayor que 0")
    private Integer batchNumber;

    @NotNull(message = "La fecha de vencimiento no puede estar vacía")
    @Future(message = "La fecha de vencimiento debe ser en el futuro")
    private LocalDate expirationDate;

    @NotNull(message = "El id del producto no puede estar vacío")
    @Positive(message = "El id del producto debe ser mayor que 0")
    private Integer productId;
}
