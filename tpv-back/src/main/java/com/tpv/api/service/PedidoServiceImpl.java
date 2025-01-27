package com.tpv.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tpv.api.entity.Pedido;
import com.tpv.api.repository.PedidoRepository;

@Service
public class PedidoServiceImpl implements IPedidoService {

    @Autowired
    PedidoRepository pedidoRepository;

    @Override
    public List<Pedido> getAll() {
        return pedidoRepository.findAll();
    }

    @Override
    public Pedido save(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    @Override
    public Pedido getByIdPedido(long id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    @Override
    public void remove(long id) {
        pedidoRepository.deleteById(id);
    }

    @Override
    public int update(Pedido pedido) {
        return pedidoRepository.update(pedido.getIdUsuario(), pedido.getIdMesa(), pedido.getPrecioTotal(), pedido.getTotalPagado(), pedido.getIdPedido());
    }

    @Override
    public Pedido getPedidosByMesa(long idMesa) {
        return pedidoRepository.findByMesa(idMesa);
    }

}
