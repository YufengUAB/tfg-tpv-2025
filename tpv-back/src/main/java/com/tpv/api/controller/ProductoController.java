package com.tpv.api.controller;

import java.util.HashMap;
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

import com.tpv.api.entity.Producto;
import com.tpv.api.service.ProductoServiceImpl;

@RestController
@RequestMapping("/api/v1/producto")
public class ProductoController {

    @Autowired
    ProductoServiceImpl productoService;
        
    @GetMapping("/productos")
    public List<Producto> getAll(){
        return productoService.getAll();
    }
    
    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody Producto producto){
        if (!productoService.findByNombreProducto(producto.getNombre())) {
            Producto nuevo_producto = productoService.save(producto);
            return new ResponseEntity<>(nuevo_producto, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<Object>("Producto ya existe", HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/producto/{id}")
    public ResponseEntity<Producto> getByIdProducto(@PathVariable long id){
        Producto productoPorId = productoService.getByIdProducto(id);
        return ResponseEntity.ok(productoPorId);
    }

    @GetMapping("/productoCategoria/{id}")
    public ResponseEntity<List<Producto>> getByIdCategoria(@PathVariable long id){
        List<Producto> productoPorCategoria = productoService.getByIdCategoria(id);
        return ResponseEntity.ok(productoPorCategoria);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<HashMap<String, Boolean>> remove(@PathVariable long id) {
        this.productoService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody Producto producto){
        int result = productoService.update(producto);
        if (result == 1) {
            return new ResponseEntity<>(producto, HttpStatus.OK);
        } else {
            return new ResponseEntity<Object>("Producto no encontrado", HttpStatus.BAD_REQUEST);
        }
    }

}
