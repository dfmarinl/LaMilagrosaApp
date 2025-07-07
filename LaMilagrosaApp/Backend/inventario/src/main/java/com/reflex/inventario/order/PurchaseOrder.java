package com.reflex.inventario.order;


import com.reflex.inventario.provider.Provider;
import com.reflex.inventario.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

//ORDEN DE COMPRA
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class PurchaseOrder extends  Order{

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "purchaseOrder")
    private Set<ProductDetail> productsDetails;

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false )
    private Provider provider;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
