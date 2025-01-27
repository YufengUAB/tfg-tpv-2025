package com.tpv.api.controller;

import java.util.HashMap;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tpv.api.entity.Usuario;
import com.tpv.api.service.UsuarioServiceImpl;

@RestController
@RequestMapping("/api/v1/user")
public class UsuarioController {

    @Autowired
    UsuarioServiceImpl usuarioService;
        
    @GetMapping("/users")
    public List<Usuario> getAll(){
        return usuarioService.getAll();
    }
    
    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody Usuario usuario){
        if (!usuarioService.findByNombreUsuario(usuario.getNombreUsuario())) {
            Date fecha = new Date(System.currentTimeMillis());
            usuario.setFechaCreacion(fecha);
            Usuario nuevo_usuario = usuarioService.save(usuario);
            return new ResponseEntity<>(nuevo_usuario, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<Object>("Usuario ya existe", HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/user/{id}")
    public ResponseEntity<Usuario> getByIdUsuario(@PathVariable long id){
        Usuario usuarioPorId = usuarioService.getByIdUsuario(id);
        return ResponseEntity.ok(usuarioPorId);
    }
    
    @PostMapping("/remove/{id}")
    public ResponseEntity<HashMap<String,Boolean>> remove(@PathVariable long id){
        this.usuarioService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<Usuario> verifyPassword(@RequestBody Usuario usuario){
        Usuario usuarioVerificado = usuarioService.verifyPassword(usuario.getNombreUsuario(), usuario.getPassword());
        if (usuarioVerificado == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return ResponseEntity.ok(usuarioVerificado);
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Integer> update(@RequestBody Usuario usuario) {
        int usuarioActualizado = usuarioService.update(usuario);
        return ResponseEntity.ok(usuarioActualizado);
    }
}
