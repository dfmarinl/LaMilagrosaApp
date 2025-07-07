package com.reflex.inventario.category;

import com.reflex.inventario.category.dto.CategoryReqDTO;
import com.reflex.inventario.category.dto.CategoryResDTO;
import com.reflex.inventario.category.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    @GetMapping
    public ResponseEntity<List<CategoryResDTO>> getAllCategories() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResDTO> getCategoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<CategoryResDTO> createCategory(@Valid @RequestBody CategoryReqDTO dto) {
        return ResponseEntity.ok(service.createCategory(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResDTO> updateCategory(@PathVariable Integer id, @Valid @RequestBody CategoryReqDTO dto) {
        return ResponseEntity.ok(service.updateCategory(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        service.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}