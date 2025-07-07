package com.reflex.inventario.product.service.impl;

import com.reflex.inventario.handler.exceptions.ProductNotFoundException;
import com.reflex.inventario.product.Product;
import com.reflex.inventario.product.ProductMapper;
import com.reflex.inventario.product.ProductRepository;
import com.reflex.inventario.product.dto.ProductReqDTO;
import com.reflex.inventario.product.dto.ProductResDTO;
import com.reflex.inventario.product.service.ProductService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductResDTO getProductById(Integer id) {
        Optional<Product> product = productRepository.findById(id);
        if(!product.isPresent()) {
            throw new ProductNotFoundException("El producto con id " + id + " no ha sido encontrado.");
        }
        return productMapper.productToDTO(product.get());
    }

    @Override
    public Set<ProductResDTO> getProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::productToDTO)
                .collect(Collectors.toSet());
    }

    @Override
    public ProductResDTO addProduct(ProductReqDTO product) {
        Product newProduct = productMapper.DtoToProduct(product);
        Product savedProduct = productRepository.save(newProduct);
        return productMapper.productToDTO(savedProduct);
    }

    @Override
    public ProductResDTO updateProduct(Integer id, ProductReqDTO productReq){
        Optional<Product> product = productRepository.findById(id);
        if(!product.isPresent()) {
            throw new ProductNotFoundException("El producto con id " + id + " no ha sido encontrado.");
        }
        Product updatedProduct = productMapper.DtoToProduct(productReq);
        updatedProduct.setCode(id);
        productRepository.save(updatedProduct);
        return productMapper.productToDTO(updatedProduct);
    }

    @Override
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }
}
