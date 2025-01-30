package com.tpv.api.controller;

import java.util.HashMap;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tpv.api.entity.Transaccion;
import com.tpv.api.service.TransaccionServiceImpl;

@RestController
@RequestMapping("/api/v1/transaccion")
public class TransaccionController {

    @Autowired
    private TransaccionServiceImpl transaccionService; // Servicio para la gestión de transacciones

    /**
     * Obtiene todas las transacciones disponibles en el sistema.
     * @return Lista de transacciones.
     */
    @GetMapping("/transacciones")
    public List<Transaccion> getAll() {
        return transaccionService.getAll();
    }

    /**
     * Guarda una nueva transacción con la fecha actual.
     * @param transaccion Datos de la transacción a guardar.
     * @return La transacción creada.
     */
    @PostMapping("/save")
    public ResponseEntity<Transaccion> save(@RequestBody Transaccion transaccion) {
        transaccion.setFechaTransaccion(new Date(System.currentTimeMillis()));
        Transaccion nuevaTransaccion = transaccionService.save(transaccion);
        return new ResponseEntity<>(nuevaTransaccion, HttpStatus.CREATED);
    }

    /**
     * Obtiene una transacción por su ID.
     * @param id Identificador de la transacción.
     * @return Transacción encontrada o una respuesta vacía si no existe.
     */
    @GetMapping("/transaccion/{id}")
    public ResponseEntity<Transaccion> getByIdTransaccion(@PathVariable long id) {
        Transaccion transaccionPorId = transaccionService.getByIdTransaccion(id);
        return ResponseEntity.ok(transaccionPorId);
    }

    /**
     * Elimina una transacción por su ID.
     * @param id Identificador de la transacción a eliminar.
     * @return Un mapa con la confirmación de eliminación.
     */
    @PostMapping("/remove/{id}")
    public ResponseEntity<HashMap<String, Boolean>> remove(@PathVariable long id) {
        transaccionService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    /**
     * Actualiza una transacción existente.
     * @param transaccion Datos de la transacción a actualizar.
     * @return Código de respuesta indicando el resultado de la actualización.
     */
    @PostMapping("/update")
    public ResponseEntity<Integer> update(@RequestBody Transaccion transaccion) {
        int transaccionActualizada = transaccionService.update(transaccion);
        return ResponseEntity.ok(transaccionActualizada);
    }

    /**
     * Obtiene una lista de transacciones asociadas a un pedido.
     * @param idPedido Identificador del pedido.
     * @return Lista de transacciones relacionadas con el pedido especificado.
     */
    @GetMapping("/transaccion/pedido/{idPedido}")
    public ResponseEntity<List<Transaccion>> findByPedido(@PathVariable long idPedido) {
        List<Transaccion> transaccionPorPedido = transaccionService.findByPedido(idPedido);
        return ResponseEntity.ok(transaccionPorPedido);
    }
}
