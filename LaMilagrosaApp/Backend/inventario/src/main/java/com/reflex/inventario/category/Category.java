package com.reflex.inventario.category;

import com.reflex.inventario.product.Product;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table( name = "category")
@EntityListeners(AuditingEntityListener.class)
public class Category {
    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private String description;

    @ManyToMany(mappedBy = "categories",
            cascade = {CascadeType.PERSIST ,CascadeType.MERGE}
    )
    private Set<Product> products;
}
