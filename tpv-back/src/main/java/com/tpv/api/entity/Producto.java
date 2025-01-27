package com.tpv.api.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Producto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id_producto")
    private long idProducto;

    @JsonProperty("nombre")
    private String nombre;

    @JsonProperty("precio")
    private double precio;

    @JsonProperty("categoria")
    private int categoria;

    @JsonProperty("cantidad_stock")
    private int cantidadStock;

    public Producto() {}

    public Producto(String nombre, double precio, int categoria, int cantidadStock) {
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.cantidadStock = cantidadStock;
    }

    public long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(long id_producto) {
        this.idProducto = id_producto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public int getCategoria() {
        return categoria;
    }   

    public void setCategoria(int categoria) {
        this.categoria = categoria;
    }

    public int getCantidadStock() {
        return cantidadStock;
    }

    public void setCantidadStock(int cantidad_stock) {
        this.cantidadStock = cantidad_stock;
    }

}
