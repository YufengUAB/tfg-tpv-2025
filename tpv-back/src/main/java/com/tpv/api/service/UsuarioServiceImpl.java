package com.tpv.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tpv.api.entity.Usuario;
import com.tpv.api.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements IUsuarioService{
    
    @Autowired
    UsuarioRepository usuarioRepository;

    @Override
    public List<Usuario> getAll() {
        return usuarioRepository.findAll();
    }
    
    @Override
    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    
    @Override
    public Usuario getByIdUsuario(long id) {
        return usuarioRepository.findById(id).orElse(null);
    }
    
    @Override
    public void remove(long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public Usuario verifyPassword(String nombreUsuario, String password) {
        Usuario usuario = usuarioRepository.findByNombreUsuarioAndPassword(nombreUsuario, password);
        if (usuario == null) {
            return null;
        } else {
            return usuario;
        }
    }

    @Override
    public int update(Usuario usuario) {
        return usuarioRepository.update(usuario.getNombreUsuario(), usuario.getPassword(), usuario.getRol(), usuario.getIdUsuario());
    }

    @Override
    public boolean findByNombreUsuario(String nombreUsuario) {
        if (usuarioRepository.findByNombreUsuario(nombreUsuario) == null) {
            return false;
        } else {
            return true;
        }
    }
}
