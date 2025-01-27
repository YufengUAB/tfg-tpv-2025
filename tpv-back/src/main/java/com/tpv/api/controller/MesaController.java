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

@RestController
@RequestMapping("/api/v1/mesa")
public class MesaController {

    @Autowired
    MesaServiceImpl mesaService;

    @GetMapping("/mesas")
    public List<Mesa> getAll(){
        return mesaService.getAll();
    }

    @GetMapping("/mesasAbiertas")
    public List<Mesa> getAllAbierto(){
        return mesaService.getAllAbierto();
    }

    @GetMapping("/mesasCerradas")
    public List<Mesa> getAllCerrado(){
        return mesaService.getAllCerrado();
    }

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody Mesa mesa){
        if (!mesaService.findByNumeroMesa(mesa.getNumero())) {
            Mesa nueva_mesa = mesaService.save(mesa);
            return new ResponseEntity<>(nueva_mesa, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<Object>("Mesa ya existe", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/mesaAbierto/{numero}")
    public MesaResponse getByNumeroMesa(@PathVariable String numero) {
        Mesa mesaPorNumero = mesaService.findByNumeroMesaAbierta(numero);
        boolean nuevaMesa = (mesaPorNumero == null);
        return new MesaResponse(nuevaMesa, mesaPorNumero);
    }


    @GetMapping("/mesa/{id}")
    public ResponseEntity<Mesa> getByIdMesa(@PathVariable long id){
        Mesa mesaPorId = mesaService.getByIdMesa(id);
        return ResponseEntity.ok(mesaPorId);
    }

    @DeleteMapping("/mesa/{id}")
    public ResponseEntity<HashMap<String,Boolean>> remove(@PathVariable long id){
        this.mesaService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/update")
    public ResponseEntity<Integer> update(@RequestBody Mesa mesa){
        int mesaActualizada = mesaService.update(mesa);
        return ResponseEntity.ok(mesaActualizada);
    }

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
