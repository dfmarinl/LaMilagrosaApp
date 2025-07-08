package com.reflex.inventario.report;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("reportes")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/ventas")
    public void getVentasReport(@RequestParam String from,
                                @RequestParam String to,
                                HttpServletResponse response) throws IOException {
        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);
        reportService.generateSalesReport(fromDate, toDate, response);
    }

    @GetMapping("/compras")
    public void getComprasReport(@RequestParam String from,
                                 @RequestParam String to,
                                 HttpServletResponse response) throws IOException {
        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);
        reportService.generatePurchaseReport(fromDate, toDate, response);
    }


    @GetMapping("/resumen")
    public ResponseEntity<ReportResumenDTO> getResumen(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        ReportResumenDTO resumen = reportService.obtenerResumenEntreFechas(from, to);
        return ResponseEntity.ok(resumen);
    }
}
