package com.tpv.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tpv.api.entity.Categoria;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    
    @Modifying
    @Transactional
    @Query("UPDATE Categoria c SET c.nombre = ?1 WHERE c.idCategoria = ?2")
    public int update(String nombre, long id);
    
    @Query("SELECT c FROM Categoria c WHERE c.nombre = ?1")
    public Categoria findByNombre(String nombre);

    @Query("SELECT c FROM Categoria c WHERE idCategoria NOT IN (SELECT categoria FROM Producto)")
    public List<Categoria> findCategoriaSinProducto();

}
