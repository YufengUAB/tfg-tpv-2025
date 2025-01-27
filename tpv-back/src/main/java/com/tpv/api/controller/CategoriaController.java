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

import com.tpv.api.entity.Categoria;
import com.tpv.api.service.CategoriaServiceImpl;

@RestController
@RequestMapping("/api/v1/categoria")
public class CategoriaController {

    @Autowired
    CategoriaServiceImpl categoriaService;
        
    @GetMapping("/categorias")
    public List<Categoria> getAll(){
        return categoriaService.getAll();
    }
    
    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody Categoria categoria){
        if (!categoriaService.findByNombre(categoria.getNombre())) {
            Categoria nueva_categoria = categoriaService.save(categoria);
            return new ResponseEntity<>(nueva_categoria, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<Object>("Categoria ya existe", HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/categoria/{id}")
    public ResponseEntity<Categoria> getByIdCategoria(@PathVariable long id){
        Categoria categoriaPorId = categoriaService.getByIdCategoria(id);
        return ResponseEntity.ok(categoriaPorId);
    }
    
    @PostMapping("/delete/{id}")
    public ResponseEntity<HashMap<String, Boolean>> remove(@PathVariable long id) {
        this.categoriaService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
    
    
    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody Categoria categoria){
        int result = categoriaService.update(categoria);
        if (result == 1) {
            return new ResponseEntity<>(categoria, HttpStatus.OK);
        } else {
            return new ResponseEntity<Object>("Producto no encontrado", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/categoriaSinProducto")
    public List<Categoria> findCategoriaSinProducto(){
        return categoriaService.findCategoriaSinProducto();
    }
    
}
