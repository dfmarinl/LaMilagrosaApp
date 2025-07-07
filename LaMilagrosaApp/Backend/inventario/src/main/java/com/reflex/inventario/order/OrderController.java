package com.reflex.inventario.order;

import com.reflex.inventario.order.dto.OrderReqDTO;
import com.reflex.inventario.order.dto.OrderResDTO;
import com.reflex.inventario.order.service.OrderService;
import com.reflex.inventario.product.dto.ProductReqDTO;
import com.reflex.inventario.product.dto.ProductResDTO;
import com.reflex.inventario.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;


    //Customer Orders

    @GetMapping("customer/findAllOrders")
    public ResponseEntity<Set<OrderResDTO>> getAllCustomerOrders() {
        return ResponseEntity.ok(orderService.getCustomerOrders());
    }

    @GetMapping("customer/{id}")
    public ResponseEntity<OrderResDTO> getCustomerOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getCustomerOrderById(id));
    }

    @PostMapping("customer/register/{email}")
    public ResponseEntity<OrderResDTO> createCustomerOrder(
            @PathVariable String email,
            @RequestBody OrderReqDTO orderReqDTO) {
        return ResponseEntity.accepted().body(orderService.addCustomerOrder(email, orderReqDTO));
    }

    @PutMapping("customer/update/{id}")
    public ResponseEntity<OrderResDTO> updateCustomerOrder(
            @PathVariable Integer id,
            @Valid @RequestBody OrderReqDTO orderReqDTO
    ) {
        return ResponseEntity.accepted().body(orderService.updateCustomerOrder(id,orderReqDTO));
    }

    @DeleteMapping("customer/{id}")
    public String deleteCustomerOrder(@PathVariable Integer id) {
        orderService.deleteCustomerOrder(id);
        return "La orden con id " + id + " ha sido eliminado";
    }


    @PostMapping("customer/aproveOrder/{id}")
    public String aproveCustomerOrder(
            @PathVariable Integer id
    ) {
        orderService.aproveCustomerOrder(id);
        return "La orden con id " + id + " ha sido aprovada";
    }





    //Purchase orders

    @GetMapping("purchase/findAllOrders")
    public ResponseEntity<Set<OrderResDTO>> getAllPurchaseOrders() {
        return ResponseEntity.ok(orderService.getPurchaseOrders());
    }

    @GetMapping("purchase/{id}")
    public ResponseEntity<OrderResDTO> getPurchaseOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getPurchaseOrderById(id));
    }

    @PostMapping("purchase/register/{email}")
    public ResponseEntity<OrderResDTO> createPurchaseOrder(
            @PathVariable String email,
            @Valid  @RequestBody OrderReqDTO orderReqDTO) {
        return ResponseEntity.accepted().body(orderService.addPurchaseOrder(email, orderReqDTO));
    }



    @PutMapping("purchase/update/{id}")
    public ResponseEntity<OrderResDTO> updatePurchaseOrder(
            @PathVariable Integer id,
            @Valid @RequestBody OrderReqDTO orderReqDTO
    ) {
        return ResponseEntity.accepted().body(orderService.updatePurchaseOrder(id,orderReqDTO));
    }

    @DeleteMapping("purchase/{id}")
    public String deletePurchaseOrder(@PathVariable Integer id) {
        orderService.deletePurchaseOrder(id);
        return "La orden con id " + id + " ha sido eliminado";
    }


    @PostMapping("purchase/aproveOrder/{id}")
    public String aprovePruchaseOrder(
            @PathVariable Integer id
    ) {
        orderService.aprovePurchaseOrder(id);
        return "La orden con id " + id + " ha sido aprovada";
    }

}
