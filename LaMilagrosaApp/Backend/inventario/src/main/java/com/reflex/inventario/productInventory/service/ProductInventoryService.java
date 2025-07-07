package com.reflex.inventario.productInventory.service;


import com.reflex.inventario.productInventory.dto.ProductInventoryReqDTO;
import com.reflex.inventario.productInventory.dto.ProductInventoryResDTO;

import java.util.Set;

public interface ProductInventoryService {

    ProductInventoryResDTO getInventoryById(Integer id);
    Set<ProductInventoryResDTO> getInventories();
    ProductInventoryResDTO addInventory(ProductInventoryReqDTO product);
    ProductInventoryResDTO updateInventory(Integer id ,ProductInventoryReqDTO product);
    void deleteInventory(Integer id);
   // void updateStock(Integer id, Integer stock);
}
