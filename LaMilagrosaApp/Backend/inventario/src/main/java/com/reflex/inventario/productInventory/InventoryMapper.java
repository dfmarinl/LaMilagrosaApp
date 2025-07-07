package com.reflex.inventario.productInventory;

import com.reflex.inventario.product.Product;
import com.reflex.inventario.product.dto.ProductReqDTO;
import com.reflex.inventario.product.dto.ProductResDTO;
import com.reflex.inventario.productInventory.dto.ProductInventoryReqDTO;
import com.reflex.inventario.productInventory.dto.ProductInventoryResDTO;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public ProductInventory DtoToInventory(ProductInventoryReqDTO DTO) {
        return ProductInventory.builder()
                .stock(DTO.getStock())
                .batchNumber(DTO.getBatchNumber())
                .expirationDate(DTO.getExpirationDate())
                .build();
    }

    public ProductInventoryResDTO inventoryToDTO(ProductInventory inventory) {
        return ProductInventoryResDTO.builder()
                .id(inventory.getId())
                .stock(inventory.getStock())
                .batchNumber(inventory.getBatchNumber())
                .expirationDate(inventory.getExpirationDate())
                .build();
    }
}
