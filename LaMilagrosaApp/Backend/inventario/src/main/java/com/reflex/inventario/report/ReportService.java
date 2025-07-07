package com.reflex.inventario.report;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.reflex.inventario.order.CustomerOrder;
import com.reflex.inventario.order.CustomerOrderRepository;
import com.reflex.inventario.order.PurchaseOrder;
import com.reflex.inventario.order.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final CustomerOrderRepository customerOrderRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public void generateSalesReport(LocalDate from, LocalDate to, HttpServletResponse response) throws IOException {
        List<CustomerOrder> orders = customerOrderRepository.findByCreatedAtBetween(from.atStartOfDay(), to.atTime(23,59));

        // Agrega aquí la lógica para calcular totales, productos más vendidos, etc.

        Document document = new Document();
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=ventas.pdf");

        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        document.add(new Paragraph("Reporte de Ventas"));
        document.add(new Paragraph("Desde: " + from + " Hasta: " + to));
        document.add(new Paragraph("Total órdenes: " + orders.size()));

        // Aquí puedes agregar una tabla u otros detalles
        document.add(new Paragraph("...detalles aquí..."));

        document.close();
    }

    public void generatePurchaseReport(LocalDate from, LocalDate to, HttpServletResponse response) throws IOException {
        List<PurchaseOrder> purchases = purchaseOrderRepository.findByCreatedAtBetween(from.atStartOfDay(), to.atTime(23,59));

        Document document = new Document();
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=compras.pdf");

        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        document.add(new Paragraph("Reporte de Compras"));
        document.add(new Paragraph("Desde: " + from + " Hasta: " + to));
        document.add(new Paragraph("Total compras: " + purchases.size()));

        document.close();
    }
}