package com.reflex.inventario.product.service;

import com.reflex.inventario.product.Product;
import com.reflex.inventario.product.dto.ProductReqDTO;
import com.reflex.inventario.product.dto.ProductResDTO;

import java.util.Optional;
import java.util.Set;

public interface ProductService {

    ProductResDTO getProductById(Integer id);
    Set<ProductResDTO> getProducts();
    ProductResDTO addProduct(ProductReqDTO product);
    ProductResDTO updateProduct(Integer id ,ProductReqDTO product);
    void deleteProduct(Integer id);
}
