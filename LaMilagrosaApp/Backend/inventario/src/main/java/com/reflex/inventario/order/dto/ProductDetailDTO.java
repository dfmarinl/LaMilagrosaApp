package com.reflex.inventario.order.dto;

import com.reflex.inventario.product.Product;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailDTO {
    private Integer quantity;//cantidad - unidades
    private Integer productCode;
}
