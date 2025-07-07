package com.reflex.inventario.product;

import com.reflex.inventario.product.dto.ProductReqDTO;
import com.reflex.inventario.product.dto.ProductResDTO;
import com.reflex.inventario.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping("/findAll")
    public ResponseEntity<Set<ProductResDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResDTO> getProductById(@Valid @PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping("/register")
    public ResponseEntity<ProductResDTO> createProduct(@RequestBody ProductReqDTO productReqDTO) {
        return ResponseEntity.accepted().body(productService.addProduct(productReqDTO));
    }

    @PutMapping("/update")
    public ResponseEntity<ProductResDTO> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody ProductReqDTO productReqDTO
    ) {
        return ResponseEntity.accepted().body(productService.updateProduct(id, productReqDTO));
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return "El producto con id " + id + " ha sido eliminado";
    }

    @PostMapping("/addCategory/{id}")
    public ResponseEntity<ProductResDTO> createProduct(
            @PathVariable Integer id,
            @RequestBody ProductReqDTO productReqDTO)
    {
        return ResponseEntity.accepted().body(productService.addProduct(productReqDTO));
    }
}
