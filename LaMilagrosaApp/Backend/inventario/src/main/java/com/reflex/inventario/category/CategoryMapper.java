package com.reflex.inventario.category;

import com.reflex.inventario.category.dto.CategoryReqDTO;
import com.reflex.inventario.category.dto.CategoryResDTO;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryReqDTO dto) {
        return Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }

    public CategoryResDTO toDTO(Category category) {
        return CategoryResDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    public void updateCategoryFromDTO(CategoryReqDTO dto, Category category) {
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
    }
}