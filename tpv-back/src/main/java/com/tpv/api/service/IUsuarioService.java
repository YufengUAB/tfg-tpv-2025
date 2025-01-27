package com.tpv.api.service;

import java.util.List;

import com.tpv.api.entity.Usuario;

public interface IUsuarioService {
    
    public List<Usuario> getAll();
    
    public Usuario save(Usuario usuario);
    
    public Usuario getByIdUsuario(long id);
    
    public void remove(long id);

    public Usuario verifyPassword(String nombreUsuario, String password);

    public int update(Usuario usuario);

    public boolean findByNombreUsuario(String nombreUsuario);
}
