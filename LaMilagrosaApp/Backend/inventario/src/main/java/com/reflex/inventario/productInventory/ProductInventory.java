package com.reflex.inventario.productInventory;

import com.reflex.inventario.product.Product;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table( name = "product_inventory")
public class ProductInventory {
    @Id
    @GeneratedValue
    private Integer id;
    private Integer stock;
    @Column(unique = true)
    private Integer batchNumber;
    private LocalDate expirationDate;

    @ManyToOne
    @JoinColumn(name = "inventory_product_id", nullable = false )
    private Product product;
}
