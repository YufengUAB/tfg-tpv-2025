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
    PedidoServiceImpl pedidoService;
        
    @GetMapping("/pedidos")
    public List<Pedido> getAll(){
        return pedidoService.getAll();
    }
    
    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody Pedido pedido){
        Date fecha = new Date(System.currentTimeMillis());
        pedido.setFechaPedido(fecha);
        Pedido nuevo_pedido = pedidoService.save(pedido);
        return new ResponseEntity<>(nuevo_pedido, HttpStatus.CREATED);
    }
    
    @GetMapping("/pedido/{id}")
    public ResponseEntity<Pedido> getByIdPedido(@PathVariable long id){
        Pedido pedidoPorId = pedidoService.getByIdPedido(id);
        return ResponseEntity.ok(pedidoPorId);
    }
    
    @DeleteMapping("/pedido/{id}")
    public ResponseEntity<HashMap<String,Boolean>> remove(@PathVariable long id){
        this.pedidoService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/update")
    public ResponseEntity<Integer> update(@RequestBody Pedido pedido){
        System.out.println(pedido.getIdPedido());
        int pedidoActualizado = pedidoService.update(pedido);
        return ResponseEntity.ok(pedidoActualizado);
    }

    @GetMapping("/mesa/{id}")
    public ResponseEntity<Pedido> getByIdMesa(@PathVariable long id){
        Pedido pedidoPorIdMesa = pedidoService.getPedidosByMesa(id);
        return ResponseEntity.ok(pedidoPorIdMesa);
    }
}
