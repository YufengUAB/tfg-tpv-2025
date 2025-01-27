package com.tpv.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tpv.api.entity.DetallePedido;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
    
    @Modifying
    @Transactional
    @Query("UPDATE DetallePedido dp SET dp.idPedido = ?1, dp.idProducto = ?2, dp.cantidad = ?3, dp.precioUnitario = ?4, dp.pagados = ?5 WHERE dp.idDetallePedido = ?6")
    public int update(int idPedido, int idProducto, int cantidad, double precioUnitario, int pagados, long id);

    @Query("SELECT dp FROM DetallePedido dp WHERE dp.idPedido = ?1")
    public Iterable<DetallePedido> findByIdPedido(int idPedido);

    @Modifying
    @Transactional
    @Query("DELETE FROM DetallePedido dp WHERE dp.idPedido = ?1")
    public void deleteByIdPedido(long idPedido);

}
