package com.reflex.inventario.productInventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductInvetoryRepository extends JpaRepository<ProductInventory, Integer> {

    @Query("""
    SELECT pi 
    FROM ProductInventory pi 
    WHERE pi.product.code = :productCode 
      AND pi.stock >= :quantity 
    ORDER BY pi.expirationDate ASC
    """)
    List<ProductInventory> findAvailableInventoriesByProductIdOrderByExpiration(
            @Param("productCode") Integer productCode,
            @Param("quantity") Integer quantity);

}
