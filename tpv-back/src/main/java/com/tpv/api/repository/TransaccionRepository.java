package com.tpv.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tpv.api.entity.Transaccion;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {
    
    @Modifying
    @Transactional
    @Query("UPDATE Transaccion t SET t.idPedido = ?1, t.metodoPago = ?2, t.totalPagado = ?3 WHERE t.idTransaccion = ?4")
    public int update(long idPedido, long metodoPago, float totalPagado, long idTransaccion);
    
    @Query("SELECT t FROM Transaccion t WHERE t.idPedido = ?1")
    public List<Transaccion> findByPedido(long idPedido);
}
