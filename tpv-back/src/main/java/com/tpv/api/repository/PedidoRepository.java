package com.tpv.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tpv.api.entity.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE Pedido p SET p.idUsuario = ?1, p.idMesa = ?2, p.precioTotal = ?3, p.totalPagado = ?4 WHERE p.idPedido = ?5")
    public int update(long idUsuario, long idMesa, float precioTotal, float totalPagado, long id);

    @Query("SELECT p FROM Pedido p WHERE p.idMesa = ?1")
    public Pedido findByMesa(long idMesa);
}
