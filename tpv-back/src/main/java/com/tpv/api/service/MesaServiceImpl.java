package com.tpv.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tpv.api.entity.Mesa;
import com.tpv.api.repository.MesaRepository;

@Service
public class MesaServiceImpl implements IMesaService{

    @Autowired
    private MesaRepository mesaRepository;

    public MesaServiceImpl(MesaRepository mesaRepository) {
        this.mesaRepository = mesaRepository;
    }

    @Override
    public List<Mesa> getAll() {
        return mesaRepository.findAll();
    }

    @Override
    public List<Mesa> getAllAbierto() {
        return mesaRepository.findAllAbierto();
    }

    public List<Mesa> getAllCerrado() {
        return mesaRepository.findAllCerrado();
    }

    @Override
    public Mesa save(Mesa mesa) {
        return mesaRepository.save(mesa);
    }

    @Override
    public Mesa getByIdMesa(long id) {
        return mesaRepository.findById(id).orElse(null);
    }

    @Override
    public void remove(long id) {
        mesaRepository.deleteById(id);
    }

    @Override
    public int update(Mesa mesa) {
        return mesaRepository.update(mesa.getNumero(), mesa.getEstado(), mesa.getIdMesa());
    }

    @Override
    public boolean findByNumeroMesa(String numeroMesa) {
        if (mesaRepository.findByNumeroMesa(numeroMesa) == null) {
            return false;
        } else {
            return true;
        }
    }

    @Override
    public Mesa findByNumeroMesaAbierta(String numeroMesa) {
        return mesaRepository.findByNumeroMesa(numeroMesa);
    
    }

}
