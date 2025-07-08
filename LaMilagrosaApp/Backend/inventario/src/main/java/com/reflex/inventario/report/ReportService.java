package com.reflex.inventario.report;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.reflex.inventario.order.*;
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
        List<CustomerOrder> orders = customerOrderRepository.findByCreatedAtBetween(from.atStartOfDay(), to.atTime(23, 59));

        Document document = new Document();
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=ventas.pdf");

        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        document.add(new Paragraph("Reporte de Ventas"));
        document.add(new Paragraph("Desde: " + from + "  Hasta: " + to));
        document.add(new Paragraph("Total órdenes: " + orders.size()));
        document.add(Chunk.NEWLINE);

        double totalVentas = 0.0;

        for (CustomerOrder order : orders) {
            document.add(new Paragraph("Orden #" + order.getNumber() + " | Fecha: " + order.getCreatedAt()));
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);

            table.addCell("Producto");
            table.addCell("Cantidad");
            table.addCell("Precio Unitario");
            table.addCell("Subtotal");

            double totalOrden = 0.0;
            for (ProductDetail detail : order.getProductsDetails()) {
                table.addCell(detail.getProduct().getName());
                table.addCell(String.valueOf(detail.getQuantity()));
                table.addCell(String.format("$%.2f", detail.getProduct().getPrice()));
                double subtotal = detail.getProduct().getPrice() * detail.getQuantity();
                table.addCell(String.format("$%.2f", subtotal));
                totalOrden += subtotal;
            }

            document.add(table);
            document.add(new Paragraph("Total orden: $" + totalOrden));
            document.add(Chunk.NEWLINE);

            totalVentas += totalOrden;
        }

        document.add(new Paragraph("💰 Total global ventas: $" + totalVentas));
        document.close();
    }


    public void generatePurchaseReport(LocalDate from, LocalDate to, HttpServletResponse response) throws IOException {
        List<PurchaseOrder> purchases = purchaseOrderRepository.findByCreatedAtBetween(from.atStartOfDay(), to.atTime(23, 59));

        Document document = new Document();
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=compras.pdf");

        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        document.add(new Paragraph("Reporte de Compras"));
        document.add(new Paragraph("Desde: " + from + "  Hasta: " + to));
        document.add(new Paragraph("Total compras: " + purchases.size()));
        document.add(Chunk.NEWLINE);

        double totalCompras = 0.0;

        for (PurchaseOrder order : purchases) {
            document.add(new Paragraph("Orden #" + order.getNumber() + " | Fecha: " + order.getCreatedAt()));
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);

            table.addCell("Producto");
            table.addCell("Cantidad");
            table.addCell("Precio Unitario");
            table.addCell("Subtotal");

            double totalOrden = 0.0;
            for (ProductDetail detail : order.getProductsDetails()) {
                table.addCell(detail.getProduct().getName());
                table.addCell(String.valueOf(detail.getQuantity()));
                table.addCell(String.format("$%.2f", detail.getProduct().getPrice()));
                double subtotal = detail.getProduct().getPrice() * detail.getQuantity();
                table.addCell(String.format("$%.2f", subtotal));
                totalOrden += subtotal;
            }

            document.add(table);
            document.add(new Paragraph("Total orden: $" + totalOrden));
            document.add(Chunk.NEWLINE);

            totalCompras+= totalOrden;
        }

        document.add(new Paragraph("💰 Total global compras: $" + totalCompras));
        document.close();
    }

    public ReportResumenDTO obtenerResumenEntreFechas(LocalDate from, LocalDate to) {
        List<CustomerOrder> ventas = customerOrderRepository.findByCreatedAtBetween(from.atStartOfDay(), to.atTime(23, 59));
        List<PurchaseOrder> compras = purchaseOrderRepository.findByCreatedAtBetween(from.atStartOfDay(), to.atTime(23, 59));

        double totalVentas = ventas.stream()
                .flatMap(order -> order.getProductsDetails().stream())
                .mapToDouble(detail -> detail.getProduct().getPrice() * detail.getQuantity())
                .sum();

        double totalCompras = compras.stream()
                .flatMap(order -> order.getProductsDetails().stream())
                .mapToDouble(detail -> detail.getProduct().getPrice() * detail.getQuantity())
                .sum();

        return ReportResumenDTO.builder()
                .totalVentas(ventas.size())
                .totalCompras(compras.size())
                .montoVentas(totalVentas)
                .montoCompras(totalCompras)
                .build();
    }
}