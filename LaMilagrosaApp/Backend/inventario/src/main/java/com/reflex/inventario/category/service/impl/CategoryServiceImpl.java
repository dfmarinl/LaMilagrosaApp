package com.reflex.inventario.category.service.impl;

import com.reflex.inventario.category.*;
import com.reflex.inventario.category.dto.CategoryReqDTO;
import com.reflex.inventario.category.dto.CategoryResDTO;
import com.reflex.inventario.category.service.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repository;
    private final CategoryMapper mapper;

    @Override
    public CategoryResDTO createCategory(CategoryReqDTO dto) {
        Category category = mapper.toEntity(dto);
        return mapper.toDTO(repository.save(category));
    }

    @Override
    public CategoryResDTO updateCategory(Integer id, CategoryReqDTO dto) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        mapper.updateCategoryFromDTO(dto, category);
        return mapper.toDTO(repository.save(category));
    }

    @Override
    public CategoryResDTO getCategoryById(Integer id) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        return mapper.toDTO(category);
    }

    @Override
    public List<CategoryResDTO> getAllCategories() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public void deleteCategory(Integer id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Category not found with id: " + id);
        }
        repository.deleteById(id);
    }
}