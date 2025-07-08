package com.reflex.inventario.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ReportResumenDTO {
    private long totalVentas;
    private long totalCompras;
    private double montoVentas;
    private double montoCompras;
}