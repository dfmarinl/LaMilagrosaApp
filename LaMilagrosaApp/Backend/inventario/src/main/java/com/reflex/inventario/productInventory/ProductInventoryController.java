package com.reflex.inventario.productInventory;

import com.reflex.inventario.productInventory.dto.ProductInventoryReqDTO;
import com.reflex.inventario.productInventory.dto.ProductInventoryResDTO;
import com.reflex.inventario.productInventory.service.ProductInventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("inventory")
@RequiredArgsConstructor
public class ProductInventoryController {
    private final ProductInventoryService productInventoryService;

    @GetMapping("/findAll")
    public ResponseEntity<Set<ProductInventoryResDTO>> getAllInventories() {
        return ResponseEntity.ok(productInventoryService.getInventories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductInventoryResDTO> getInventoryById(@Valid @PathVariable Integer id) {
        return ResponseEntity.ok(productInventoryService.getInventoryById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<ProductInventoryResDTO> createInventory(@RequestBody ProductInventoryReqDTO inventoryReqDTO) {
        return ResponseEntity.accepted().body(productInventoryService.addInventory(inventoryReqDTO));
    }

    @PutMapping("/update")
    public ResponseEntity<ProductInventoryResDTO> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody ProductInventoryReqDTO inventoryReqDTO
    ) {
        return ResponseEntity.accepted().body(productInventoryService.updateInventory(id, inventoryReqDTO));
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Integer id) {
        productInventoryService.deleteInventory(id);
        return "El producto con id " + id + " ha sido eliminado";
    }
}
