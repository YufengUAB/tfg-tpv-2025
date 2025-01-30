package com.tpv.api.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tpv.api.entity.DetallePedido;
import com.tpv.api.service.DetallePedidoServiceImpl;

/**
 * Controlador REST para gestionar operaciones relacionadas con detalles de pedidos.
 * Expone endpoints para obtener, crear, actualizar y eliminar detalles de pedidos.
 */
@RestController
@RequestMapping("/api/v1/detallepedido")
public class DetallePedidoController {

    @Autowired
    private DetallePedidoServiceImpl detallePedidoService;

    /**
     * Obtiene todos los detalles de pedidos.
     * 
     * @return Lista de todos los detalles de pedidos.
     */
    @GetMapping("/detallepedidos")
    public List<DetallePedido> getAll() {
        return detallePedidoService.getAll();
    }

    /**
     * Guarda un nuevo detalle de pedido.
     * 
     * @param detallePedido Detalle de pedido a guardar.
     * @return ResponseEntity con el detalle de pedido creado.
     */
    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody DetallePedido detallePedido) {
        DetallePedido nuevoDetallePedido = detallePedidoService.save(detallePedido);
        return new ResponseEntity<>(nuevoDetallePedido, HttpStatus.CREATED);
    }

    /**
     * Obtiene un detalle de pedido por su ID.
     * 
     * @param id ID del detalle de pedido.
     * @return ResponseEntity con el detalle de pedido encontrado.
     */
    @GetMapping("/detallepedido/{id}")
    public ResponseEntity<DetallePedido> getByIdDetallePedido(@PathVariable long id) {
        DetallePedido detallePedidoPorId = detallePedidoService.getByIdDetallePedido(id);
        return ResponseEntity.ok(detallePedidoPorId);
    }

    /**
     * Elimina un detalle de pedido por su ID.
     * 
     * @param id ID del detalle de pedido a eliminar.
     * @return ResponseEntity con un mensaje de confirmación.
     */
    @DeleteMapping("/detallepedido/{id}")
    public ResponseEntity<HashMap<String, Boolean>> remove(@PathVariable long id) {
        detallePedidoService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    /**
     * Actualiza un detalle de pedido existente.
     * 
     * @param detallePedido Detalle de pedido con los datos actualizados.
     * @return ResponseEntity con el número de filas afectadas.
     */
    @PostMapping("/update")
    public ResponseEntity<Integer> update(@RequestBody DetallePedido detallePedido) {
        int detallePedidoActualizado = detallePedidoService.update(detallePedido);
        return ResponseEntity.ok(detallePedidoActualizado);
    }

    /**
     * Obtiene los detalles de pedido asociados a un pedido específico.
     * 
     * @param idPedido ID del pedido.
     * @return ResponseEntity con los detalles de pedido encontrados.
     */
    @GetMapping("/pedido/{idPedido}")
    public ResponseEntity<Iterable<DetallePedido>> findByIdPedido(@PathVariable int idPedido) {
        Iterable<DetallePedido> detallePedidoPorIdPedido = detallePedidoService.findByIdPedido(idPedido);
        return ResponseEntity.ok(detallePedidoPorIdPedido);
    }
}