package com.reflex.inventario.order;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass //Clase padre
@SuperBuilder
public class Order {
    @Id
    @GeneratedValue
    private Integer number;
    private LocalDate date;
    private Integer IVA;
    private Boolean aproved;
    private LocalDateTime createdAt;


}
