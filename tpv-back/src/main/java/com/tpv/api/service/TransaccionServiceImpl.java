package com.tpv.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tpv.api.entity.Transaccion;
import com.tpv.api.repository.TransaccionRepository;

@Service
public class TransaccionServiceImpl implements ITransaccionService {

    @Autowired
    TransaccionRepository transaccionRepository;

    @Override
    public List<Transaccion> getAll() {
        return transaccionRepository.findAll();
    }

    @Override
    public Transaccion save(Transaccion transaccion) {
        return transaccionRepository.save(transaccion);
    }

    @Override
    public Transaccion getByIdTransaccion(long id) {
        return transaccionRepository.findById(id).orElse(null);
    }

    @Override
    public List<Transaccion> findByPedido(long idPedido) {
        List<Transaccion> transaccion = transaccionRepository.findByPedido(idPedido);
        if (transaccion == null) {
            return null;
        } else {
            return transaccion;
        }
    }

    @Override
    public void remove(long id) {
        transaccionRepository.deleteById(id);
    }

    @Override
    public int update(Transaccion transaccion) {
        return transaccionRepository.update(transaccion.getIdPedido(), transaccion.getMetodoPago(),
                transaccion.getTotalPagado(), transaccion.getIdTransaccion());
    }

}
