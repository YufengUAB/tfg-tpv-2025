package com.tpv.api.impresora;

import javax.print.*;
import javax.print.attribute.*;
import java.io.*;
import java.text.Normalizer;
import org.springframework.stereotype.Service;

@Service
public class FacturaService {

    public void generarYImprimirFactura(FacturaRequest facturaRequest) throws Exception {
        String factura = construirFactura(facturaRequest);
        enviarAImpresora(factura);
    }

    private String construirFactura(FacturaRequest facturaRequest) {
        StringBuilder factura = new StringBuilder();
        factura.append("--------------------------------\n")
               .append("            Bar UAB             \n")
               .append("              UAB               \n")
               .append("      Telefono: 123-456-789     \n")
               .append("--------------------------------\n")
               .append("Mesa: ").append(facturaRequest.getMesa()).append("\n")
               .append("Total: ").append(facturaRequest.getPrecioTotal()).append("$").append("\n")
               .append("--------------------------------\n")
               .append("Cant  Producto       Total      \n")
               .append("--------------------------------\n");

        for (FacturaRequest.DetallePedido detalle : facturaRequest.getDetallePedido()) {
            String nombreProductoSinAcentos = eliminarAcentos(detalle.getNombreProducto());  // Eliminar acentos
            factura.append(String.format("%-5d %-15s %6.2f$\n",  // Usar nombre sin acentos
                    detalle.getCantidad(),
                    nombreProductoSinAcentos,
                    detalle.getTotal()));
        }

        factura.append("--------------------------------\n")
               .append("Gracias por su compra\n")
               .append("--------------------------------\n\n\n");

        return factura.toString();
    }

    private void enviarAImpresora(String factura) throws Exception {
        // Obtener la impresora predeterminada
        System.out.println("Buscando impresora predeterminada...");
        PrintService printService = PrintServiceLookup.lookupDefaultPrintService();
        if (printService == null) {
            throw new Exception("No se encontró una impresora predeterminada.");
        }
        System.out.println("Impresora predeterminada encontrada: " + printService.getName());
        // Convertir el texto de la factura en un flujo de bytes con UTF-8
        InputStream is = new ByteArrayInputStream(factura.getBytes("UTF-8"));
        Doc documento = new SimpleDoc(is, DocFlavor.INPUT_STREAM.AUTOSENSE, null);

        // Crear un trabajo de impresión
        DocPrintJob job = printService.createPrintJob();

        // Imprimir
        job.print(documento, null);
    }

    // Método para eliminar acentos de un texto
    public static String eliminarAcentos(String texto) {
        if (texto == null) {
            return null;
        }
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                        .replaceAll("[^\\p{ASCII}]", "");
    }
}
