package com.reflex.inventario.order;

import com.reflex.inventario.order.dto.OrderReqDTO;
import com.reflex.inventario.order.dto.OrderResDTO;
import com.reflex.inventario.product.Product;
import com.reflex.inventario.product.ProductRepository;
import com.reflex.inventario.product.dto.ProductReqDTO;
import com.reflex.inventario.product.dto.ProductResDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final ProductRepository productRepository;

    public CustomerOrder DTOtoCustomerOrder(OrderReqDTO orderReqDTO) {
        var order = CustomerOrder.builder()
                .date(orderReqDTO.getDate())
                .IVA(orderReqDTO.getIVA())
                .build();

        Set<ProductDetail> details = orderReqDTO.getProductsDetails().stream().map(detailDto -> {
            Product product = productRepository.findById(detailDto.getProductCode())
                    .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con código: " + detailDto.getProductCode()));

            return ProductDetail.builder()
                    .quantity(detailDto.getQuantity())
                    .product(product)
                    .customerOrder(order)
                    .build();
        }).collect(Collectors.toSet());

        order.setProductsDetails(details);
        return order;
    }

    public OrderResDTO customerOrderToDTO(CustomerOrder customerOrder) {
        return OrderResDTO.builder()
                .number(customerOrder.getNumber())
                .date(customerOrder.getDate())
                .IVA(customerOrder.getIVA())
                .aproved(customerOrder.getAproved())
                .build();
    }


    public PurchaseOrder DTOtoPurchaseOrder(OrderReqDTO orderReqDTO) {
        return PurchaseOrder.builder()
                .date(orderReqDTO.getDate())
                .IVA(orderReqDTO.getIVA())
                .build();

    }

    public OrderResDTO purchaseOrderToDTO(PurchaseOrder purchaseOrder) {
        return OrderResDTO.builder()
                .number(purchaseOrder.getNumber())
                .date(purchaseOrder.getDate())
                .IVA(purchaseOrder.getIVA())
                .aproved(purchaseOrder.getAproved())
                .build();
    }
}
