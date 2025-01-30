package com.tpv.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tpv.api.impresora.FacturaRequest;
import com.tpv.api.impresora.FacturaService;

/**
 * Controlador REST para gestionar la generación e impresión de facturas.
 */
@RestController
@RequestMapping("/api/facturas")
public class FacturaController {

    private final FacturaService facturaService;

    /**
     * Constructor para inyectar el servicio de facturas.
     * 
     * @param facturaService Servicio que maneja la lógica de generación e impresión de facturas.
     */
    public FacturaController(FacturaService facturaService) {
        this.facturaService = facturaService;
    }

    /**
     * Endpoint para generar e imprimir una factura.
     * 
     * @param facturaRequest Datos de la factura a generar e imprimir.
     * @return ResponseEntity con un mensaje de éxito o error.
     */
    @PostMapping("/imprimir")
    public ResponseEntity<String> imprimirFactura(@RequestBody FacturaRequest facturaRequest) {
        try {
            System.out.println("Generando e imprimiendo factura...");
            facturaService.generarYImprimirFactura(facturaRequest);
            return ResponseEntity.ok("Factura generada e impresa con éxito.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al generar/imprimir la factura.");
        }
    }
}