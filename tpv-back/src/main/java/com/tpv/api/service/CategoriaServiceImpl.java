package com.tpv.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tpv.api.entity.Categoria;
import com.tpv.api.repository.CategoriaRepository;

@Service
public class CategoriaServiceImpl implements ICategoriaService {

    @Autowired
    CategoriaRepository categoriaRepository;

    @Override
    public List<Categoria> getAll() {
        return categoriaRepository.findAll();
    }

    @Override
    public Categoria save(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Override
    public Categoria getByIdCategoria(long id) {
        return categoriaRepository.findById(id).orElse(null);
    }

    @Override
    public void remove(long id) {
        categoriaRepository.deleteById(id);
    }

    @Override
    public int update(Categoria categoria) {
        return categoriaRepository.update(categoria.getNombre(), categoria.getIdCategoria());
    }

    @Override
    public boolean findByNombre(String nombreCategoria) {
        if (categoriaRepository.findByNombre(nombreCategoria) == null) {
            return false;
        } else {
            return true;
        }
    }

    @Override
    public List<Categoria> findCategoriaSinProducto() {
        return categoriaRepository.findCategoriaSinProducto();
    }

}
