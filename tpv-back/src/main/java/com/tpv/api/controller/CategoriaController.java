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

/**
 * Controlador REST para gestionar operaciones relacionadas con categorías.
 * Expone endpoints para obtener, crear, actualizar y eliminar categorías.
 */
@RestController
@RequestMapping("/api/v1/categoria")
public class CategoriaController {

    @Autowired
    private CategoriaServiceImpl categoriaService;

    /**
     * Obtiene todas las categorías.
     * 
     * @return Lista de todas las categorías.
     */
    @GetMapping("/categorias")
    public List<Categoria> getAll() {
        return categoriaService.getAll();
    }

    /**
     * Guarda una nueva categoría.
     * 
     * @param categoria Categoría a guardar.
     * @return ResponseEntity con la categoría creada o un mensaje de error si ya existe.
     */
    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody Categoria categoria) {
        if (!categoriaService.findByNombre(categoria.getNombre())) {
            Categoria nueva_categoria = categoriaService.save(categoria);
            return new ResponseEntity<>(nueva_categoria, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Categoría ya existe", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Obtiene una categoría por su ID.
     * 
     * @param id ID de la categoría.
     * @return ResponseEntity con la categoría encontrada.
     */
    @GetMapping("/categoria/{id}")
    public ResponseEntity<Categoria> getByIdCategoria(@PathVariable long id) {
        Categoria categoriaPorId = categoriaService.getByIdCategoria(id);
        return ResponseEntity.ok(categoriaPorId);
    }

    /**
     * Elimina una categoría por su ID.
     * 
     * @param id ID de la categoría a eliminar.
     * @return ResponseEntity con un mensaje de confirmación.
     */
    @PostMapping("/delete/{id}")
    public ResponseEntity<HashMap<String, Boolean>> remove(@PathVariable long id) {
        categoriaService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    /**
     * Actualiza una categoría existente.
     * 
     * @param categoria Categoría con los datos actualizados.
     * @return ResponseEntity con la categoría actualizada o un mensaje de error si no se encuentra.
     */
    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody Categoria categoria) {
        int result = categoriaService.update(categoria);
        if (result == 1) {
            return new ResponseEntity<>(categoria, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Categoría no encontrada", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Obtiene las categorías que no tienen productos asociados.
     * 
     * @return Lista de categorías sin productos.
     */
    @GetMapping("/categoriaSinProducto")
    public List<Categoria> findCategoriaSinProducto() {
        return categoriaService.findCategoriaSinProducto();
    }
}