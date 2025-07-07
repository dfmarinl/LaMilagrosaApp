package com.reflex.inventario.order.service.impl;

import com.reflex.inventario.handler.exceptions.InventoryNotFoundException;
import com.reflex.inventario.handler.exceptions.OrderNotFoundException;
import com.reflex.inventario.order.*;
import com.reflex.inventario.order.dto.OrderReqDTO;
import com.reflex.inventario.order.dto.OrderResDTO;
import com.reflex.inventario.order.service.OrderService;


import com.reflex.inventario.product.Product;
import com.reflex.inventario.product.ProductRepository;
import com.reflex.inventario.productInventory.ProductInventory;
import com.reflex.inventario.productInventory.ProductInvetoryRepository;
import com.reflex.inventario.user.User;
import com.reflex.inventario.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final CustomerOrderRepository customerOrderRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductInvetoryRepository productInvetoryRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    @Override
    public OrderResDTO getCustomerOrderById(Integer id) {
        Optional<CustomerOrder> customerOrder = customerOrderRepository.findById(id);
        if (customerOrder.isEmpty()) {
            throw new OrderNotFoundException("El la orden de pedido con el id " + id + " no ha sido encontrada.");
        }
        return orderMapper.customerOrderToDTO(customerOrder.get());
    }

    @Override
    public Set<OrderResDTO> getCustomerOrders() {
        return customerOrderRepository.findAll().stream()
                .map(orderMapper::customerOrderToDTO)
                .collect(Collectors.toSet());
    }

    @Override
    public OrderResDTO addCustomerOrder(String email, OrderReqDTO orderReqDTO) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new EntityNotFoundException("El usuario con el correo " + email + " no ha sido encontrado.");
        }
        User user = optionalUser.get();
        CustomerOrder newOrder = orderMapper.DTOtoCustomerOrder(orderReqDTO);
        newOrder.setUser(user);

        if (newOrder.getProductsDetails() != null) {
            newOrder.getProductsDetails().forEach(detail -> detail.setCustomerOrder(newOrder));
        }
        CustomerOrder savedOrder = customerOrderRepository.save(newOrder);
        return orderMapper.customerOrderToDTO(savedOrder);
    }


    @Override
    public OrderResDTO updateCustomerOrder(Integer id, OrderReqDTO orderReqDTO) {
        Optional<CustomerOrder> customerOrder = customerOrderRepository.findById(id);
        if (customerOrder.isEmpty()) {
            throw new OrderNotFoundException("El la orden de pedido con el id " + id + " no ha sido encontrada.");
        }
        CustomerOrder updatedOrder = orderMapper.DTOtoCustomerOrder(orderReqDTO);
        updatedOrder.setNumber(id);
        customerOrderRepository.save(updatedOrder);
        return orderMapper.customerOrderToDTO(updatedOrder);
    }

    @Override
    public void deleteCustomerOrder(Integer id) {
        customerOrderRepository.deleteById(id);
    }


    @Override
    @Transactional
    public void aproveCustomerOrder(Integer id) {
        Optional<CustomerOrder> customerOrder = customerOrderRepository.findById(id);
        if (customerOrder.isEmpty()) {
            throw new OrderNotFoundException("El la orden de pedido con el id " + id + " no ha sido encontrada.");
        }
        CustomerOrder aprovedCustomerOrder = customerOrder.get();
        aprovedCustomerOrder.setAproved(false);
        //1. Verificar disponibilidad de productos
        aprovedCustomerOrder.getProductsDetails().stream()
                .forEach(productDetail -> {
                    List<ProductInventory> availableInventories = productInvetoryRepository
                            .findAvailableInventoriesByProductIdOrderByExpiration(productDetail.getProduct().getCode(), productDetail.getQuantity());
                    if (availableInventories.isEmpty()) {
                        throw new InventoryNotFoundException("No se han encontrado unidades diponibles para el producto + " + productDetail.getProduct().getName() + " asi que la orden fue cancelada");
                    } else {
                        Integer finalStock = availableInventories.get(0).getStock() - productDetail.getQuantity();
                        ProductInventory updatedInventory = availableInventories.get(0);
                        updatedInventory.setStock(finalStock);
                        productInvetoryRepository.save(updatedInventory);
                    }
                });
        aprovedCustomerOrder.setAproved(true);
        customerOrderRepository.save(aprovedCustomerOrder);

    }


    //Purchase
    @Override
    public OrderResDTO getPurchaseOrderById(Integer id) {
        Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findById(id);
        if (purchaseOrder.isEmpty()) {
            throw new OrderNotFoundException("El la orden de compra con el id " + id + " no ha sido encontrada.");
        }
        return orderMapper.purchaseOrderToDTO(purchaseOrder.get());
    }

    @Override
    public Set<OrderResDTO> getPurchaseOrders() {
        return purchaseOrderRepository.findAll().stream()
                .map(orderMapper::purchaseOrderToDTO)
                .collect(Collectors.toSet());
    }

    @Override
    public OrderResDTO addPurchaseOrder(OrderReqDTO orderReqDTO) {
        PurchaseOrder newOrder = orderMapper.DTOtoPurchaseOrder(orderReqDTO);
        PurchaseOrder savedOrder = purchaseOrderRepository.save(newOrder);
        return orderMapper.purchaseOrderToDTO(savedOrder);
    }

    @Override
    public OrderResDTO updatePurchaseOrder(Integer id, OrderReqDTO orderReqDTO) {
        Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findById(id);
        if (purchaseOrder.isEmpty()) {
            throw new OrderNotFoundException("El la orden de compra con el id " + id + " no ha sido encontrada.");
        }
        PurchaseOrder updatedOrder = orderMapper.DTOtoPurchaseOrder(orderReqDTO);
        updatedOrder.setNumber(id);
        purchaseOrderRepository.save(updatedOrder);
        return orderMapper.purchaseOrderToDTO(updatedOrder);
    }

    @Override
    public void deletePurchaseOrder(Integer id) {
        purchaseOrderRepository.deleteById(id);
    }

    @Override
    public void aprovePurchaseOrder(Integer id) {
        Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findById(id);
        if (purchaseOrder.isEmpty()) {
            throw new OrderNotFoundException("El la orden de compra con el id " + id + " no ha sido encontrada.");
        }
        PurchaseOrder aprovedPurchaseOrder = purchaseOrder.get();
        aprovedPurchaseOrder.setAproved(true);


        purchaseOrderRepository.save(aprovedPurchaseOrder);

    }
}
