package com.tpv.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tpv.api.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    @Query("SELECT u FROM Usuario u WHERE u.nombreUsuario = ?1 AND u.password = ?2")
    public Usuario findByNombreUsuarioAndPassword(String nombreUsuario, String password);
    
    @Modifying
    @Transactional
    @Query("UPDATE Usuario u SET u.nombreUsuario = ?1, u.password = ?2, u.rol = ?3 WHERE u.idUsuario = ?4")
    public int update(String nombreUsuario, String password, String rol, long id);

    @Query("SELECT u FROM Usuario u WHERE u.nombreUsuario = ?1")
    public Usuario findByNombreUsuario(String nombreUsuario);
}