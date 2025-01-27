package com.tpv.api.service;

import java.util.List;

import com.tpv.api.entity.Mesa;

public interface IMesaService {

    public List<Mesa> getAll();

    public List<Mesa> getAllAbierto();

    public Mesa save(Mesa mesa);

    public Mesa getByIdMesa(long id);

    public void remove(long id);

    public int update(Mesa mesa);

    public boolean findByNumeroMesa(String numeroMesa);    

    public Mesa findByNumeroMesaAbierta(String numeroMesa);   

}
