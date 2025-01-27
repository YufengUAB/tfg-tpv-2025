package com.tpv.api.service;

import java.util.List;

import com.tpv.api.entity.Categoria;

public interface ICategoriaService {

    public List<Categoria> getAll();

    public Categoria save(Categoria categoria);

    public Categoria getByIdCategoria(long id);

    public void remove(long id);

    public int update(Categoria categoria);

    public boolean findByNombre(String nombreCategoria);

    public List<Categoria> findCategoriaSinProducto();

}
