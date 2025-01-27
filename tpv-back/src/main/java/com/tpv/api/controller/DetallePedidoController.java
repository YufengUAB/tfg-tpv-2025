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

@RestController
@RequestMapping("/api/v1/detallepedido")
public class DetallePedidoController {

    @Autowired
    DetallePedidoServiceImpl detallePedidoService;
        
    @GetMapping("/detallepedidos")
    public List<DetallePedido> getAll(){
        return detallePedidoService.getAll();
    }
    
    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody DetallePedido detallePedido){
        DetallePedido nuevo_detallePedido = detallePedidoService.save(detallePedido);
        return new ResponseEntity<>(nuevo_detallePedido, HttpStatus.CREATED);
    }
    
    @GetMapping("/detallepedido/{id}")
    public ResponseEntity<DetallePedido> getByIdDetallePedido(@PathVariable long id){
        DetallePedido detallePedidoPorId = detallePedidoService.getByIdDetallePedido(id);
        return ResponseEntity.ok(detallePedidoPorId);
    }
    
    @DeleteMapping("/detallepedido/{id}")
    public ResponseEntity<HashMap<String,Boolean>> remove(@PathVariable long id){
        this.detallePedidoService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/update")
    public ResponseEntity<Integer> update(@RequestBody DetallePedido detallePedido){
        int detallePedidoActualizado = detallePedidoService.update(detallePedido);
        return ResponseEntity.ok(detallePedidoActualizado);
    }

    @GetMapping("/pedido/{idPedido}")
    public ResponseEntity<Iterable<DetallePedido>> findByIdPedido(@PathVariable int idPedido){
        Iterable<DetallePedido> detallePedidoPorIdPedido = detallePedidoService.findByIdPedido(idPedido);
        return ResponseEntity.ok(detallePedidoPorIdPedido);
    }
    
}
