package com.reflex.inventario.order.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResDTO {
    private Integer number;
    private LocalDate date;
    private Integer IVA;
    private Boolean aproved;
    private Integer providerId;
}
