package com.reflex.inventario.order;

import com.reflex.inventario.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

//ORDEN DE PEDIDO
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class CustomerOrder extends Order {

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "customerOrder")
    private Set<ProductDetail> productsDetails;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false )
    private User user;

}
