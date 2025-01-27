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
    TransaccionServiceImpl transaccionService;
        
    @GetMapping("/transacciones")
    public List<Transaccion> getAll(){
        return transaccionService.getAll();
    }
    
    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody Transaccion transaccion){
        Date fecha = new Date(System.currentTimeMillis());
        transaccion.setFechaTransaccion(fecha);
        Transaccion nueva_transaccion = transaccionService.save(transaccion);
        return new ResponseEntity<>(nueva_transaccion, HttpStatus.CREATED);
    }
    
    @GetMapping("/transaccion/{id}")
    public ResponseEntity<Transaccion> getByIdTransaccion(@PathVariable long id){
        Transaccion transaccionPorId = transaccionService.getByIdTransaccion(id);
        return ResponseEntity.ok(transaccionPorId);
    }

    @PostMapping("/remove/{id}")
    public ResponseEntity<HashMap<String,Boolean>> remove(@PathVariable long id){
        this.transaccionService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/update")
    public ResponseEntity<Integer> update(@RequestBody Transaccion transaccion){
        int transaccionActualizada = transaccionService.update(transaccion);
        return ResponseEntity.ok(transaccionActualizada);
    }

    @GetMapping("/transaccion/pedido/{idPedido}")
    public ResponseEntity<List<Transaccion>> findByPedido(@PathVariable long idPedido){
        List<Transaccion> transaccionPorPedido = transaccionService.findByPedido(idPedido);
        return ResponseEntity.ok(transaccionPorPedido);
    }

}
