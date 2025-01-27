package com.tpv.api.entity;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Pedido implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id_pedido")
    private long idPedido;

    @JsonProperty("id_usuario")
    private long idUsuario;

    @JsonProperty("id_mesa")
    private long idMesa;

    @JsonProperty("fecha_pedido")
    private Date fechaPedido;

    @JsonProperty("precio_total")
    private float precioTotal;

    @JsonProperty("total_pagado")
    private float totalPagado;

    public Pedido() {}

    public Pedido(long id_usuario, long id_mesa) {
        Date fecha = new Date(System.currentTimeMillis());
        this.fechaPedido = fecha;
        this.idUsuario = id_usuario;
        this.idMesa = id_mesa;
        this.precioTotal = 0;
        this.totalPagado = 0;
    }

    public long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(int id_pedido) {
        this.idPedido = id_pedido;
    }

    public long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(long id_usuario) {
        this.idUsuario = id_usuario;
    }

    public long getIdMesa() {
        return idMesa;
    }

    public void setIdMesa(int id_mesa) {
        this.idMesa = id_mesa;
    }

    public Date getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(Date fecha_pedido) {
        this.fechaPedido = fecha_pedido;
    }

    public float getPrecioTotal() {
        return precioTotal;
    }

    public void setPrecioTotal(float precio_total) {
        this.precioTotal = precio_total;
    }

    public float getTotalPagado() {
        return totalPagado;
    }

    public void setTotalPagado(float total_pagado) {
        this.totalPagado = total_pagado;
    }
}
