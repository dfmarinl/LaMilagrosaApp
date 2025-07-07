package com.reflex.inventario.productInventory.service.impl;

import com.reflex.inventario.handler.exceptions.InventoryNotFoundException;
import com.reflex.inventario.handler.exceptions.ProductNotFoundException;
import com.reflex.inventario.product.Product;
import com.reflex.inventario.product.ProductRepository;
import com.reflex.inventario.productInventory.InventoryMapper;
import com.reflex.inventario.productInventory.ProductInventory;
import com.reflex.inventario.productInventory.ProductInvetoryRepository;
import com.reflex.inventario.productInventory.dto.ProductInventoryReqDTO;
import com.reflex.inventario.productInventory.dto.ProductInventoryResDTO;
import com.reflex.inventario.productInventory.service.ProductInventoryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductInventoryServiceImpl implements ProductInventoryService {

    private final ProductInvetoryRepository productInvetoryRepository;
    private final ProductRepository productRepository;
    private final InventoryMapper inventoryMapper;

    @Override
    public ProductInventoryResDTO getInventoryById(Integer id) {
        Optional<ProductInventory> inventory = productInvetoryRepository.findById(id);
        if(!inventory.isPresent()) {
            throw new InventoryNotFoundException("El inventario con id " + id + " no ha sido encontrado.");
        }
        return inventoryMapper.inventoryToDTO(inventory.get());
    }

    @Override
    public Set<ProductInventoryResDTO> getInventories() {
        return productInvetoryRepository.findAll().stream()
                .map(inventoryMapper::inventoryToDTO)
                .collect(Collectors.toSet());
    }

    @Override
    public ProductInventoryResDTO addInventory(ProductInventoryReqDTO inventory) {
        //1. Validar que el producto asociado exista
        Optional<Product> product = productRepository.findById(inventory.getProductId());
        if(!product.isPresent()) {
            throw new ProductNotFoundException("El producto con id " + inventory.getProductId() + " no ha sido encontrado.");
        }
        // 2. asociar producto
        ProductInventory newInventory = inventoryMapper.DtoToInventory(inventory);
        newInventory.setProduct(product.get());
        ProductInventory savedInventory = productInvetoryRepository.save(newInventory);
        return inventoryMapper.inventoryToDTO(savedInventory);
    }

    @Override
    public ProductInventoryResDTO updateInventory(Integer id, ProductInventoryReqDTO inventoryReq) {
        Optional<ProductInventory> inventory = productInvetoryRepository.findById(id);
        if(!inventory.isPresent()) {
            throw new ProductNotFoundException("El inventario con id " + id + " no ha sido encontrado.");
        }
        ProductInventory updatedInventory = inventory.get();
        updatedInventory.setStock(inventoryReq.getStock());

        productInvetoryRepository.save(updatedInventory);
        return inventoryMapper.inventoryToDTO(updatedInventory);
    }

    @Override
    public void deleteInventory(Integer id) {
        productInvetoryRepository.deleteById(id);
    }

    /*@Override
    public void updateStock(Integer id, Integer stock) {
        Optional<ProductInventory> inventory = productInvetoryRepository.findById(id);
        if(!inventory.isPresent()) {
            throw new ProductNotFoundException("El inventario con id " + id + " no ha sido encontrado.");
        }
        inventory.get().setStock(stock);
    }*/

}
