package com.reflex.inventario.order;

import com.reflex.inventario.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {
    List<PurchaseOrder> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
}
