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

import com.tpv.api.entity.Mesa;
import com.tpv.api.service.MesaServiceImpl;

/**
 * Controlador REST para gestionar operaciones relacionadas con mesas.
 * Expone endpoints para obtener, crear, actualizar y eliminar mesas.
 */
@RestController
@RequestMapping("/api/v1/mesa")
public class MesaController {

    @Autowired
    private MesaServiceImpl mesaService;

    /**
     * Obtiene todas las mesas.
     * 
     * @return Lista de todas las mesas.
     */
    @GetMapping("/mesas")
    public List<Mesa> getAll() {
        return mesaService.getAll();
    }

    /**
     * Obtiene todas las mesas abiertas.
     * 
     * @return Lista de mesas abiertas.
     */
    @GetMapping("/mesasAbiertas")
    public List<Mesa> getAllAbierto() {
        return mesaService.getAllAbierto();
    }

    /**
     * Obtiene todas las mesas cerradas.
     * 
     * @return Lista de mesas cerradas.
     */
    @GetMapping("/mesasCerradas")
    public List<Mesa> getAllCerrado() {
        return mesaService.getAllCerrado();
    }

    /**
     * Guarda una nueva mesa.
     * 
     * @param mesa Mesa a guardar.
     * @return ResponseEntity con la mesa creada o un mensaje de error si ya existe.
     */
    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody Mesa mesa) {
        if (!mesaService.findByNumeroMesa(mesa.getNumero())) {
            Mesa nuevaMesa = mesaService.save(mesa);
            return new ResponseEntity<>(nuevaMesa, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Mesa ya existe", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Obtiene una mesa abierta por su número.
     * 
     * @param numero Número de la mesa.
     * @return Objeto MesaResponse que indica si la mesa es nueva y la mesa encontrada.
     */
    @GetMapping("/mesaAbierto/{numero}")
    public MesaResponse getByNumeroMesa(@PathVariable String numero) {
        Mesa mesaPorNumero = mesaService.findByNumeroMesaAbierta(numero);
        boolean nuevaMesa = (mesaPorNumero == null);
        return new MesaResponse(nuevaMesa, mesaPorNumero);
    }

    /**
     * Obtiene una mesa por su ID.
     * 
     * @param id ID de la mesa.
     * @return ResponseEntity con la mesa encontrada.
     */
    @GetMapping("/mesa/{id}")
    public ResponseEntity<Mesa> getByIdMesa(@PathVariable long id) {
        Mesa mesaPorId = mesaService.getByIdMesa(id);
        return ResponseEntity.ok(mesaPorId);
    }

    /**
     * Elimina una mesa por su ID.
     * 
     * @param id ID de la mesa a eliminar.
     * @return ResponseEntity con un mensaje de confirmación.
     */
    @DeleteMapping("/mesa/{id}")
    public ResponseEntity<HashMap<String, Boolean>> remove(@PathVariable long id) {
        mesaService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    /**
     * Actualiza una mesa existente.
     * 
     * @param mesa Mesa con los datos actualizados.
     * @return ResponseEntity con el número de filas afectadas.
     */
    @PostMapping("/update")
    public ResponseEntity<Integer> update(@RequestBody Mesa mesa) {
        int mesaActualizada = mesaService.update(mesa);
        return ResponseEntity.ok(mesaActualizada);
    }

    /**
     * Clase interna para manejar la respuesta de una consulta de mesa.
     */
    public class MesaResponse {
        private boolean nuevaMesa;
        private Mesa mesa;

        public MesaResponse(boolean nuevaMesa, Mesa mesa) {
            this.nuevaMesa = nuevaMesa;
            this.mesa = mesa;
        }

        public boolean isNuevaMesa() {
            return nuevaMesa;
        }

        public Mesa getMesa() {
            return mesa;
        }
    }
}