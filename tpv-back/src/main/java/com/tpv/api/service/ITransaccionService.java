package com.tpv.api.service;

import java.util.List;

import com.tpv.api.entity.Transaccion;

public interface ITransaccionService {
        
    public List<Transaccion> getAll();

    public Transaccion save(Transaccion transaccion);

    public Transaccion getByIdTransaccion(long id);

    public void remove(long id);

    public int update(Transaccion transaccion);

    public List<Transaccion> findByPedido(long idPedido);

}
