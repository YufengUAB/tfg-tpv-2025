package com.tpv.api.service;

import java.util.List;

import com.tpv.api.entity.DetallePedido;

public interface IDetallePedidoService {

    public List<DetallePedido> getAll();

    public DetallePedido save(DetallePedido detallePedido);

    public DetallePedido getByIdDetallePedido(long id);

    public void remove(long id);

    public int update(DetallePedido detallePedido);

    public Iterable<DetallePedido> findByIdPedido(int idPedido);

    public void removeByIdPedido(long idPedido);
}
