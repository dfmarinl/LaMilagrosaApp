package com.reflex.inventario.alert;

import com.reflex.inventario.alert.AlertWebSocketService;
import com.reflex.inventario.productInventory.ProductInventory;
import com.reflex.inventario.productInventory.ProductInvetoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InventoryAlertScheduler {

    private final ProductInvetoryRepository productInventoryRepository;
    private final AlertWebSocketService alertWebSocketService;

    @Scheduled(cron = "0 0 8 * * ?") // Todos los días a las 8 AM
    public void checkInventoryDates() {
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysLater = today.plusDays(7);

        // Productos ya vencidos
        List<ProductInventory> expired = productInventoryRepository.findByExpirationDateLessThanEqual(today);
        expired.forEach(product -> {
            String msg = "⚠ Producto vencido: " + product.getProduct().getName() +
                    " (Fecha: " + product.getExpirationDate() + ")";
            alertWebSocketService.sendProductExpiredAlert(msg);
        });

        // Productos próximos a vencer (hoy + 7 días o menos)
        List<ProductInventory> expiringSoon = productInventoryRepository.findByExpirationDateBetween(today.plusDays(1), sevenDaysLater);
        expiringSoon.forEach(product -> {
            String msg = "🔔 Producto por vencer pronto: " + product.getProduct().getName() +
                    " (Vence: " + product.getExpirationDate() + ")";
            alertWebSocketService.sendProductExpiredAlert(msg);
        });
    }
}