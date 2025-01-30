package com.tpv.api.controller;

import java.sql.Date;
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

import com.tpv.api.entity.Pedido;
import com.tpv.api.service.PedidoServiceImpl;

@RestController
@RequestMapping("/api/v1/pedido")
public class PedidoController {

    @Autowired
    PedidoServiceImpl pedidoService; // Servicio para la gestión de pedidos

    /**
     * Obtiene todos los pedidos almacenados en el sistema.
     * @return Lista de pedidos.
     */
    @GetMapping("/pedidos")
    public List<Pedido> getAll() {
        return pedidoService.getAll();
    }

    /**
     * Crea un nuevo pedido con la fecha actual.
     * @param pedido Datos del pedido a guardar.
     * @return El pedido creado con código de estado 201 (CREATED).
     */
    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody Pedido pedido) {
        Date fecha = new Date(System.currentTimeMillis()); // Asigna la fecha actual al pedido
        pedido.setFechaPedido(fecha);
        Pedido nuevo_pedido = pedidoService.save(pedido);
        return new ResponseEntity<>(nuevo_pedido, HttpStatus.CREATED);
    }

    /**
     * Obtiene un pedido por su ID.
     * @param id Identificador del pedido.
     * @return Pedido encontrado o una respuesta vacía si no existe.
     */
    @GetMapping("/pedido/{id}")
    public ResponseEntity<Pedido> getByIdPedido(@PathVariable long id) {
        Pedido pedidoPorId = pedidoService.getByIdPedido(id);
        return ResponseEntity.ok(pedidoPorId);
    }

    /**
     * Elimina un pedido por su ID.
     * @param id Identificador del pedido a eliminar.
     * @return Un mapa con la confirmación de eliminación.
     */
    @DeleteMapping("/pedido/{id}")
    public ResponseEntity<HashMap<String, Boolean>> remove(@PathVariable long id) {
        pedidoService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    /**
     * Actualiza un pedido existente.
     * @param pedido Datos del pedido a actualizar.
     * @return Un entero que indica el resultado de la actualización.
     */
    @PostMapping("/update")
    public ResponseEntity<Integer> update(@RequestBody Pedido pedido) {
        System.out.println(pedido.getIdPedido()); // Depuración: imprime el ID del pedido
        int pedidoActualizado = pedidoService.update(pedido);
        return ResponseEntity.ok(pedidoActualizado);
    }

    /**
     * Obtiene un pedido asociado a una mesa específica.
     * @param id Identificador de la mesa.
     * @return Pedido correspondiente a la mesa.
     */
    @GetMapping("/mesa/{id}")
    public ResponseEntity<Pedido> getByIdMesa(@PathVariable long id) {
        Pedido pedidoPorIdMesa = pedidoService.getPedidosByMesa(id);
        return ResponseEntity.ok(pedidoPorIdMesa);
    }
}
