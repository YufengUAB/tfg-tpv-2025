package com.tpv.api.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Categoria implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id_categoria")
    private long idCategoria;

    @JsonProperty("nombre")
    private String nombre;

    public Categoria() {}

    public Categoria(String nombre) {
        this.nombre = nombre;
    }

    public long getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(long id_categoria) {
        this.idCategoria = id_categoria;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

}
