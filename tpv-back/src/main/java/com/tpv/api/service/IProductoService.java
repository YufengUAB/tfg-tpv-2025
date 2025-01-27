package com.tpv.api.service;

import java.util.List;

import com.tpv.api.entity.Producto;

public interface IProductoService {

    public List<Producto> getAll();

    public Producto save(Producto producto);

    public Producto getByIdProducto(long id);

    public void remove(long id);

    public int update(Producto producto);

    public boolean findByNombreProducto(String nombreProducto);

    public List<Producto> getByIdCategoria(long id);
    
}
