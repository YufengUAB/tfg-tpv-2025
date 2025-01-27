package com.tpv.api.entity;

import java.io.Serializable;
import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id_usuario")
    private long idUsuario;

    @JsonProperty("nombre_usuario")
    private String nombreUsuario;

    @JsonProperty("password")
    private String password;

    @JsonProperty("rol")
    private String rol;

    @JsonProperty("fecha_creacion")
    private Date fechaCreacion;

    public Usuario() {}

    public long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(long id_usuario) {
        this.idUsuario = id_usuario;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombre_usuario) {
        this.nombreUsuario = nombre_usuario;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fecha_creacion) {
        this.fechaCreacion = fecha_creacion;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }
}
