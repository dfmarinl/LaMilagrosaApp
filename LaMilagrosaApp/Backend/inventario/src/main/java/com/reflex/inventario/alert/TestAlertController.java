package com.reflex.inventario.alert;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("alert")
@RequiredArgsConstructor
public class TestAlertController {

    private final AlertWebSocketService alertWebSocketService;

    @GetMapping
    public ResponseEntity<String> enviarAlerta() {
        alertWebSocketService.sendProductExpiredAlert("🧪 Alerta de prueba desde el backend");
        return ResponseEntity.ok("Alerta enviada");
    }
}
