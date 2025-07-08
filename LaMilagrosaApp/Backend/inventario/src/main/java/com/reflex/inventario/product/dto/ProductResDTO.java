package com.reflex.inventario.product.dto;

import com.reflex.inventario.category.dto.CategoryResDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Set;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResDTO {
    private Integer code;
    private String name;
    private String description;
    private Float price;
    private String image;
    private CategoryResDTO category;

}
