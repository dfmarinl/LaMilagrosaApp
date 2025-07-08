package com.reflex.inventario.product;

import com.reflex.inventario.category.Category;
import com.reflex.inventario.category.CategoryMapper;
import com.reflex.inventario.category.CategoryRepository;
import com.reflex.inventario.product.dto.ProductReqDTO;
import com.reflex.inventario.product.dto.ProductResDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class ProductMapper {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public Product DtoToProduct(ProductReqDTO productReqDTO) {
        // Buscar la categoría
        Category category = categoryRepository.findById(productReqDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        return Product.builder()
                .name(productReqDTO.getName())
                .description(productReqDTO.getDescription())
                .price(productReqDTO.getPrice())
                .image(productReqDTO.getImage())
                .categories(Set.of(category)) // Construir el Set con una sola categoría
                .build();
    }

    public ProductResDTO productToDTO(Product product) {
        return ProductResDTO.builder()
                .code(product.getCode())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .image(product.getImage())
                .category(
                        product.getCategories().stream()
                                .findFirst()
                                .map(categoryMapper::toDTO)
                                .orElse(null)
                )
                .build();
    }
}
