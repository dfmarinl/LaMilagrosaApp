package com.reflex.inventario.productInventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductInventoryResDTO {
    private Integer id;
    private Integer stock;
    private Integer batchNumber;
    private LocalDate expirationDate;
    private String productName;
    private String productImage;
}
