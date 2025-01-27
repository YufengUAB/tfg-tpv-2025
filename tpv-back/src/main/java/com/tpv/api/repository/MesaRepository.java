package com.tpv.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import com.tpv.api.entity.Mesa;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {
    
    @Modifying
    @Transactional
    @Query("UPDATE Mesa m SET m.numero = ?1, m.estado = ?2 WHERE m.idMesa = ?3")
    public int update(String numero, int estado, long id);

    @Query("SELECT m FROM Mesa m WHERE m.numero = ?1 AND m.estado IN (1, 2)")
    public Mesa findByNumeroMesa(String numeroMesa);

    @Query(value = "SELECT * FROM mesa m WHERE m.estado IN (1, 2) ORDER BY CAST(m.numero AS UNSIGNED)", nativeQuery = true)
    public List<Mesa> findAllAbierto();

    @Query(value = "SELECT * FROM mesa m WHERE m.estado = 3 ORDER BY CAST(m.numero AS UNSIGNED)", nativeQuery = true)
    public List<Mesa> findAllCerrado();

}
