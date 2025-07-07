package com.reflex.inventario.report;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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
    public void getVentasReport(@RequestParam String desde,
                                @RequestParam String hasta,
                                HttpServletResponse response) throws IOException {
        LocalDate from = LocalDate.parse(desde);
        LocalDate to = LocalDate.parse(hasta);
        reportService.generateSalesReport(from, to, response);
    }

    @GetMapping("/compras")
    public void getComprasReport(@RequestParam String desde,
                                 @RequestParam String hasta,
                                 HttpServletResponse response) throws IOException {
        LocalDate from = LocalDate.parse(desde);
        LocalDate to = LocalDate.parse(hasta);
        reportService.generatePurchaseReport(from, to, response);
    }
}
