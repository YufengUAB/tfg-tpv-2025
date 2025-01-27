package com.tpv.api.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "detalle_pedido")
public class DetallePedido implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id_detalle_pedido")
    private long idDetallePedido;

    @JsonProperty("id_pedido")
    private int idPedido;

    @JsonProperty("id_producto")
    private int idProducto;

    @JsonProperty("cantidad")
    private int cantidad;

    @JsonProperty("precio_unitario")
    private float precioUnitario;

    @JsonProperty("pagados")
    private int pagados;

    public long getIdDetallePedido() {
        return idDetallePedido;
    }

    public void setIdDetallePedido(long idDetallePedido) {
        this.idDetallePedido = idDetallePedido;
    }

    public int getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(int idPedido) {
        this.idPedido = idPedido;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public float getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(float precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public int getPagados() {
        return pagados;
    }

    public void setPagados(int pagados) {
        this.pagados = pagados;
    }
}
