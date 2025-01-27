package com.tpv.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tpv.api.entity.DetallePedido;
import com.tpv.api.repository.DetallePedidoRepository;

@Service
public class DetallePedidoServiceImpl implements IDetallePedidoService {

    @Autowired
    DetallePedidoRepository detallePedidoRepository;

    @Override
    public List<DetallePedido> getAll() {
        return detallePedidoRepository.findAll();
    }

    @Override
    public DetallePedido save(DetallePedido detallePedido) {
        return detallePedidoRepository.save(detallePedido);
    }

    @Override
    public DetallePedido getByIdDetallePedido(long id) {
        return detallePedidoRepository.findById(id).orElse(null);
    }

    @Override
    public void remove(long id) {
        detallePedidoRepository.deleteById(id);
    }

    @Override
    public int update(DetallePedido detallePedido) {
        return detallePedidoRepository.update(detallePedido.getIdPedido(), detallePedido.getIdProducto(), detallePedido.getCantidad(), detallePedido.getPrecioUnitario(), detallePedido.getPagados(), detallePedido.getIdDetallePedido());
    }

    @Override
    public Iterable<DetallePedido> findByIdPedido(int idPedido) {
        return detallePedidoRepository.findByIdPedido(idPedido);
    }

    @Override
    public void removeByIdPedido(long idPedido) {
        detallePedidoRepository.deleteByIdPedido(idPedido);
    }
}
