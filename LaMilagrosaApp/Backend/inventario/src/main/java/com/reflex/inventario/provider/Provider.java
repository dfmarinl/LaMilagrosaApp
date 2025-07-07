package com.reflex.inventario.provider;

import com.reflex.inventario.order.PurchaseOrder;
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
@Table( name = "provider")
public class Provider {
    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private Integer phone;
    private String address;
    private String email;

    @OneToMany(mappedBy = "provider",
    cascade = CascadeType.ALL,
    orphanRemoval = true)
    private Set<PurchaseOrder> purchaseOrders;
}
