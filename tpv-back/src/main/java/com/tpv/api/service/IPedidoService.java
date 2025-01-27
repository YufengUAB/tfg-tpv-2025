package com.tpv.api.service;

import java.util.List;

import com.tpv.api.entity.Pedido;;

public interface IPedidoService {

    public List<Pedido> getAll();

    public Pedido save(Pedido pedido);

    public Pedido getByIdPedido(long id);

    public void remove(long id);

    public int update(Pedido pedido);

    public Pedido getPedidosByMesa(long idMesa);
}
