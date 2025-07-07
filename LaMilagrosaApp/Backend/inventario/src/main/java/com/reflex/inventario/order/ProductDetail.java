package com.reflex.inventario.order;

import com.reflex.inventario.product.Product;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table( name = "product_detail")
public class ProductDetail {
    @Id
    @GeneratedValue
    private Integer id;
    private Integer quantity;//cantidad - unidades

    @OneToOne()
    private Product product;

    @ManyToOne
    @JoinColumn(name = "customer_order_number", nullable = true )
    private CustomerOrder customerOrder;

    @ManyToOne
    @JoinColumn(name = "purchase_order_number", nullable = true )
    private PurchaseOrder purchaseOrder;



}
