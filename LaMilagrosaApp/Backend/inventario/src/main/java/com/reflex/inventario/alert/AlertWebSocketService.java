package com.reflex.inventario.alert;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlertWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendProductExpiredAlert(String message) {
        messagingTemplate.convertAndSend("/topic/alertas", message);
    }
}