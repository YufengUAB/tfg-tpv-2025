package com.tpv.api.entity;

import java.io.Serializable;
import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Transaccion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id_transaccion")
    private long idTransaccion;

    @JsonProperty("id_pedido")
    private long idPedido;

    @JsonProperty("metodo_pago")
    private long metodoPago;

    @JsonProperty("fecha_transaccion")
    private Date fechaTransaccion;

    @JsonProperty("total_pagado")
    private float totalPagado;

    public Transaccion() {}

    public long getIdTransaccion() {
        return idTransaccion;
    }

    public void setIdTransaccion(long idTransaccion) {
        this.idTransaccion = idTransaccion;
    }

    public long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(long idPedido) {
        this.idPedido = idPedido;
    }

    public long getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(long metodoPago) {
        this.metodoPago = metodoPago;
    }

    public Date getFechaTransaccion() {
        return fechaTransaccion;
    }

    public void setFechaTransaccion(Date fechaTransaccion) {
        this.fechaTransaccion = fechaTransaccion;
    }

    public float getTotalPagado() {
        return totalPagado;
    }

    public void setTotalPagado(float totalPagado) {
        this.totalPagado = totalPagado;
    }
}
