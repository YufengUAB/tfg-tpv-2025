package com.tpv.api.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Mesa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id_mesa")
    private long idMesa;

    @JsonProperty("numero")
    private String numero;

    @JsonProperty("estado")
    private int estado;

    public Mesa() {}

    public Mesa(String numero) {
        this.numero = numero;
        this.estado = 1;
    }

    public long getIdMesa() {
        return idMesa;
    }

    public void setIdMesa(long idMesa) {
        this.idMesa = idMesa;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public int getEstado() {
        return estado;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

}
