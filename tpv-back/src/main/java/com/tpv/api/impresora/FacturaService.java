package com.tpv.api.impresora;

import javax.print.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import org.springframework.stereotype.Service;

@Service
public class FacturaService {

    /**
     * Genera una factura en formato de texto y la envía a la impresora.
     * @param facturaRequest Datos de la factura, incluyendo mesa, total y productos.
     * @throws Exception Si ocurre un error durante la impresión.
     */
    public void generarYImprimirFactura(FacturaRequest facturaRequest) throws Exception {
        String factura = construirFactura(facturaRequest);
        enviarAImpresora(factura);
    }

    /**
     * Construye el formato de la factura en texto plano.
     * @param facturaRequest Datos de la factura.
     * @return String con el contenido de la factura.
     */
    private String construirFactura(FacturaRequest facturaRequest) {
        StringBuilder factura = new StringBuilder();
        factura.append("--------------------------------\n")
               .append("            Bar UAB             \n")
               .append("              UAB               \n")
               .append("      Telefono: 123-456-789     \n")
               .append("--------------------------------\n")
               .append("Mesa: ").append(facturaRequest.getMesa()).append("\n")
               .append("Total: ").append(String.format("%.2f$", facturaRequest.getPrecioTotal())).append("\n")
               .append("--------------------------------\n")
               .append("Cant  Producto       Total      \n")
               .append("--------------------------------\n");

        for (FacturaRequest.DetallePedido detalle : facturaRequest.getDetallePedido()) {
            // Se eliminan los acentos del nombre del producto para evitar problemas con la impresión
            String nombreProductoSinAcentos = eliminarAcentos(detalle.getNombreProducto());
            factura.append(String.format("%-5d %-15s %6.2f$\n",
                    detalle.getCantidad(),
                    nombreProductoSinAcentos,
                    detalle.getTotal()));
        }

        factura.append("--------------------------------\n")
               .append("Gracias por su compra\n")
               .append("--------------------------------\n\n\n");

        return factura.toString();
    }

    /**
     * Envía el texto de la factura a la impresora predeterminada del sistema.
     * @param factura Texto de la factura a imprimir.
     * @throws Exception Si no se encuentra una impresora o hay un error de impresión.
     */
    private void enviarAImpresora(String factura) throws Exception {
        System.out.println("Buscando impresora predeterminada...");
        PrintService printService = PrintServiceLookup.lookupDefaultPrintService();

        if (printService == null) {
            throw new Exception("No se encontró una impresora predeterminada.");
        }
        System.out.println("Impresora encontrada: " + printService.getName());

        // Uso de try-with-resources para evitar fugas de memoria
        try (InputStream is = new ByteArrayInputStream(factura.getBytes(StandardCharsets.UTF_8))) {
            Doc documento = new SimpleDoc(is, DocFlavor.INPUT_STREAM.AUTOSENSE, null);
            DocPrintJob job = printService.createPrintJob();
            job.print(documento, null);
        } catch (PrintException e) {
            throw new Exception("Error al imprimir la factura: " + e.getMessage(), e);
        }
    }

    /**
     * Elimina acentos de una cadena de texto para evitar problemas de codificación al imprimir.
     * @param texto Texto con caracteres acentuados.
     * @return Texto sin acentos.
     */
    public static String eliminarAcentos(String texto) {
        if (texto == null) {
            return null;
        }
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                        .replaceAll("[^\\p{ASCII}]", ""); // Elimina caracteres no ASCII
    }
}
