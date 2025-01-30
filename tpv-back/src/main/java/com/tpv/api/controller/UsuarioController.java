package com.tpv.api.controller;

import java.util.HashMap;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tpv.api.entity.Usuario;
import com.tpv.api.service.UsuarioServiceImpl;

@RestController
@RequestMapping("/api/v1/user")
public class UsuarioController {

    @Autowired
    private UsuarioServiceImpl usuarioService; // Inyección del servicio de usuarios

    /**
     * Obtiene todos los usuarios registrados en el sistema.
     * @return Lista de usuarios.
     */
    @GetMapping("/users")
    public ResponseEntity<List<Usuario>> getAll() {
        List<Usuario> usuarios = usuarioService.getAll();
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Guarda un nuevo usuario si no existe previamente.
     * @param usuario Datos del usuario a registrar.
     * @return Usuario creado o mensaje de error si ya existe.
     */
    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody Usuario usuario) {
        if (!usuarioService.findByNombreUsuario(usuario.getNombreUsuario())) {
            usuario.setFechaCreacion(new Date(System.currentTimeMillis()));
            Usuario nuevoUsuario = usuarioService.save(usuario);
            return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El usuario ya existe.");
        }
    }

    /**
     * Obtiene un usuario por su ID.
     * @param id Identificador del usuario.
     * @return Usuario encontrado o respuesta vacía si no existe.
     */
    @GetMapping("/user/{id}")
    public ResponseEntity<Usuario> getByIdUsuario(@PathVariable long id) {
        Usuario usuarioPorId = usuarioService.getByIdUsuario(id);
        return ResponseEntity.ok(usuarioPorId);
    }

    /**
     * Elimina un usuario por su ID.
     * @param id Identificador del usuario a eliminar.
     * @return Confirmación de eliminación.
     */
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<HashMap<String, Boolean>> remove(@PathVariable long id) {
        usuarioService.remove(id);
        HashMap<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    /**
     * Verifica las credenciales de un usuario para iniciar sesión.
     * @param usuario Datos del usuario (nombre de usuario y contraseña).
     * @return Usuario autenticado o error si las credenciales son incorrectas.
     */
    @PostMapping("/login")
    public ResponseEntity<Usuario> verifyPassword(@RequestBody Usuario usuario) {
        Usuario usuarioVerificado = usuarioService.verifyPassword(usuario.getNombreUsuario(), usuario.getPassword());
        return (usuarioVerificado != null) ? ResponseEntity.ok(usuarioVerificado) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Actualiza los datos de un usuario.
     * @param usuario Datos del usuario a actualizar.
     * @return Código de respuesta indicando el resultado de la actualización.
     */
    @PutMapping("/update")
    public ResponseEntity<Integer> update(@RequestBody Usuario usuario) {
        int usuarioActualizado = usuarioService.update(usuario);
        return ResponseEntity.ok(usuarioActualizado);
    }
}
