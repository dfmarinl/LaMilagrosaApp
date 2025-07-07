package com.reflex.inventario.category.service;

import com.reflex.inventario.category.dto.CategoryReqDTO;
import com.reflex.inventario.category.dto.CategoryResDTO;

import java.util.List;

public interface CategoryService {
    CategoryResDTO createCategory(CategoryReqDTO dto);
    CategoryResDTO updateCategory(Integer id, CategoryReqDTO dto);
    CategoryResDTO getCategoryById(Integer id);
    List<CategoryResDTO> getAllCategories();
    void deleteCategory(Integer id);
}