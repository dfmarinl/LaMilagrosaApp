package com.reflex.inventario.order.service;

import com.reflex.inventario.order.dto.OrderReqDTO;
import com.reflex.inventario.order.dto.OrderResDTO;


import java.util.Set;

public interface OrderService {
    //Customer Order
    OrderResDTO getCustomerOrderById(Integer id);
    Set<OrderResDTO> getCustomerOrders();
    OrderResDTO addCustomerOrder(String email, OrderReqDTO orderReqDTO);
    OrderResDTO updateCustomerOrder(Integer id, OrderReqDTO orderReqDTO);
    void deleteCustomerOrder(Integer id);
    void aproveCustomerOrder(Integer id);

    //Purchase order
    OrderResDTO getPurchaseOrderById(Integer id);
    Set<OrderResDTO> getPurchaseOrders();
    OrderResDTO addPurchaseOrder(OrderReqDTO orderReqDTO);
    OrderResDTO updatePurchaseOrder(Integer id, OrderReqDTO orderReqDTO);
    void deletePurchaseOrder(Integer id);
    void aprovePurchaseOrder(Integer id);
}
