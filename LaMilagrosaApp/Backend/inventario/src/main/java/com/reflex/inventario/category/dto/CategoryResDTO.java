package com.reflex.inventario.category.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResDTO {
    private Integer id;
    private String name;
    private String description;
}
