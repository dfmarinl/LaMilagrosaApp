package com.reflex.inventario.product;

import com.reflex.inventario.product.Product;
import com.reflex.inventario.product.dto.ProductReqDTO;
import com.reflex.inventario.product.dto.ProductResDTO;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product DtoToProduct(ProductReqDTO productReqDTO) {
        return Product.builder()
                .name(productReqDTO.getName())
                .description(productReqDTO.getDescription())
                .price(productReqDTO.getPrice())
                .image(productReqDTO.getImage())
                .build();
    }

    public ProductResDTO productToDTO(Product product) {
        return ProductResDTO.builder()
                .code(product.getCode())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .image(product.getImage())
                .build();
    }
}
