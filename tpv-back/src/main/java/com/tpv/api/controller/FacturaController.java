package com.tpv.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tpv.api.impresora.FacturaRequest;
import com.tpv.api.impresora.FacturaService;

@RestController
@RequestMapping("/api/facturas")
public class FacturaController {

    private final FacturaService facturaService;

    public FacturaController(FacturaService facturaService) {
        this.facturaService = facturaService;
    }

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
