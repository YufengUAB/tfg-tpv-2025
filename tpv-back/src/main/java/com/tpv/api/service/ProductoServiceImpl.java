package com.tpv.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tpv.api.entity.Producto;
import com.tpv.api.repository.ProductoRepository;

@Service
public class ProductoServiceImpl implements IProductoService {

    @Autowired
    ProductoRepository productoRepository;

    @Override
    public List<Producto> getAll() {
        return productoRepository.findAll();
    }

    @Override
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public Producto getByIdProducto(long id) {
        return productoRepository.findById(id).orElse(null);
    }

    @Override
    public void remove(long id) {
        productoRepository.deleteById(id);
    }

    @Override
    public int update(Producto producto) {
        return productoRepository.update(producto.getNombre(), producto.getPrecio(), producto.getCategoria(), producto.getCantidadStock(), producto.getIdProducto());
    }

    @Override
    public boolean findByNombreProducto(String nombreProducto) {
        if (productoRepository.findByNombreProducto(nombreProducto) == null) {
            return false;
        } else {
            return true;
        }
    }

    @Override
    public List<Producto> getByIdCategoria(long id) {
        return productoRepository.findByIdCategoria(id);
    }

}
