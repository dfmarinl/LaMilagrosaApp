package com.reflex.inventario.product;

import com.reflex.inventario.category.Category;
import com.reflex.inventario.order.ProductDetail;
import com.reflex.inventario.productInventory.ProductInventory;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table( name = "product")
public class Product {
    @Id
    @GeneratedValue
    private Integer code;
    private String name;
    private String description;
    private Float price;
    private String image;

    @ManyToMany(cascade = {CascadeType.PERSIST ,CascadeType.MERGE})
    @JoinTable(
            name = "product_category",
            joinColumns = @JoinColumn(name = "product_code"),//owner side
            inverseJoinColumns = @JoinColumn(name = "category_id")

    )
    //@NotEmpty(message = "El producto debe tener al menos una categoría")
    private Set<Category> categories;

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "product")
    private Set<ProductInventory> productInventories;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
   /* @JoinTable(name = "product_productDetail",
    joinColumns = { @JoinColumn(name = "product_code", referencedColumnName = "code")},
    inverseJoinColumns = {@JoinColumn(name="productDetail_id", referencedColumnName = "id")}
    )*/
    private Set<ProductDetail> productDetails;


}
