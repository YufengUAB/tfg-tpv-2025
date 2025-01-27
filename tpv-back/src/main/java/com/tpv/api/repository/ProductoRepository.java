package com.tpv.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.tpv.api.entity.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query("SELECT p FROM Producto p WHERE p.nombre = ?1")
    public Producto findByNombreProducto(String nombre);

    @Modifying
    @Transactional
    @Query("UPDATE Producto p SET p.nombre = ?1, p.precio = ?2, p.categoria = ?3, p.cantidadStock = ?4 WHERE p.idProducto = ?5")
    public int update(String nombre, double precio, int categoria, int cantidadStock, long id);

    @Query("SELECT p FROM Producto p WHERE p.categoria = ?1")
    public List<Producto> findByIdCategoria(long id);
}
