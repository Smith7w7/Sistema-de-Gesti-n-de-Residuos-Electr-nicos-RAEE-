package com.example.demo.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Cliente;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.service.ClienteService;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService service;

    // 1. INDEX - Listar todos los clientes (Acceso: ADMIN y VENDEDOR)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public List<Cliente> index() {
        return service.listar();
    }

    // 2. SHOW - Obtener detalle de cliente por ID (Acceso: ADMIN y VENDEDOR)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Cliente> show(@PathVariable Long id) {
        Cliente cliente = service.buscarPorId(id);
        if (cliente == null) {
            throw new ResourceNotFoundException("Cliente no encontrado con el ID: " + id);
        }
        return ResponseEntity.ok(cliente);
    }

    // 3. CREATE - Registrar nuevo cliente con validaciones Bean Validation (Acceso: ADMIN y VENDEDOR)
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Cliente> create(@Valid @RequestBody Cliente cliente) {
        Cliente nuevo = service.guardar(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    // 4. UPDATE - Actualizar cliente existente con validaciones (Acceso: ADMIN y VENDEDOR)
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Cliente> update(@PathVariable Long id, @Valid @RequestBody Cliente cliente) {
        Cliente existente = service.buscarPorId(id);
        if (existente == null) {
            throw new ResourceNotFoundException("No se puede actualizar. Cliente no encontrado con ID: " + id);
        }
        cliente.setId(id);
        Cliente actualizado = service.guardar(cliente);
        return ResponseEntity.ok(actualizado);
    }

    // 5. DELETE - Eliminar cliente (Acceso exclusivo: ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Cliente existente = service.buscarPorId(id);
        if (existente == null) {
            throw new ResourceNotFoundException("No se puede eliminar. Cliente no encontrado con ID: " + id);
        }
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // --- Consultas Especializadas ---

    @GetMapping("/identificacion/{identificacion}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Cliente> buscarPorIdentificacion(@PathVariable String identificacion) {
        return service.buscarPorIdentificacion(identificacion)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con identificación: " + identificacion));
    }

    @GetMapping("/tipo/{tipo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public List<Cliente> buscarPorTipo(@PathVariable String tipo) {
        return service.buscarPorTipo(tipo);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Cliente> buscarPorEmail(@PathVariable String email) {
        return service.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con email: " + email));
    }
}
