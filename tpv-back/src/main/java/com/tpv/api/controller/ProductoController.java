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
    private ProductoServiceImpl productoService; // Servicio para la gestión de productos

    /**
     * Obtiene todos los productos disponibles en el sistema.
     * @return Lista de productos.
     */
    @GetMapping("/productos")
    public List<Producto> getAll() {
        return productoService.getAll();
    }

    /**
     * Guarda un nuevo producto si no existe otro con el mismo nombre.
     * @param producto Datos del producto a guardar.
     * @return El producto creado o un mensaje de error si ya existe.
     */
    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody Producto producto) {
        if (!productoService.findByNombreProducto(producto.getNombre())) {
            Producto nuevoProducto = productoService.save(producto);
            return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Producto ya existe", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Obtiene un producto por su ID.
     * @param id Identificador del producto.
     * @return Producto encontrado o una respuesta vacía si no existe.
     */
    @GetMapping("/producto/{id}")
    public ResponseEntity<Producto> getByIdProducto(@PathVariable long id) {
        Producto productoPorId = productoService.getByIdProducto(id);
        return ResponseEntity.ok(productoPorId);
    }

    /**
     * Obtiene una lista de productos por su categoría.
     * @param id Identificador de la categoría.
     * @return Lista de productos pertenecientes a la categoría especificada.
     */
    @GetMapping("/productoCategoria/{id}")
    public ResponseEntity<List<Producto>> getByIdCategoria(@PathVariable long id) {
        List<Producto> productoPorCategoria = productoService.getByIdCategoria(id);
        return ResponseEntity.ok(productoPorCategoria);
    }

    /**
     * Elimina un producto por su ID.
     * @param id Identificador del producto a eliminar.
     * @return Un mapa con la confirmación de eliminación.
     */
    @PostMapping("/delete/{id}")
    public ResponseEntity<HashMap<String, Boolean>> remove(@PathVariable long id) {
        productoService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    /**
     * Actualiza un producto existente.
     * @param producto Datos del producto a actualizar.
     * @return Producto actualizado o un mensaje de error si no se encuentra.
     */
    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody Producto producto) {
        int result = productoService.update(producto);
        if (result == 1) {
            return new ResponseEntity<>(producto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Producto no encontrado", HttpStatus.BAD_REQUEST);
        }
    }
}
