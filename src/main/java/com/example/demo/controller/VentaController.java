package com.example.demo.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Venta;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.service.VentaService;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService service;

    // 1. INDEX - Listar todas las transacciones de venta (Acceso: ADMIN y VENDEDOR)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public List<Venta> index() {
        return service.listar();
    }

    // 2. SHOW - Obtener detalle de venta por ID (Acceso: ADMIN y VENDEDOR)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Venta> show(@PathVariable Long id) {
        Venta venta = service.buscarPorId(id);
        if (venta == null) {
            throw new ResourceNotFoundException("Venta no encontrada con ID: " + id);
        }
        return ResponseEntity.ok(venta);
    }

    // 3. CREATE - Registrar nueva venta con detalles (Acceso: ADMIN y VENDEDOR)
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Venta> create(@Valid @RequestBody Venta venta) {
        Venta creada = service.guardar(venta);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    // 4. UPDATE - Actualizar estado de venta (Acceso: ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Venta> update(@PathVariable Long id, @Valid @RequestBody Venta venta) {
        Venta existente = service.buscarPorId(id);
        if (existente == null) {
            throw new ResourceNotFoundException("No se puede actualizar. Venta no encontrada con ID: " + id);
        }
        venta.setId(id);
        Venta actualizada = service.guardar(venta);
        return ResponseEntity.ok(actualizada);
    }

    // 5. DELETE - Anular o eliminar venta (Acceso exclusivo: ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Venta existente = service.buscarPorId(id);
        if (existente == null) {
            throw new ResourceNotFoundException("No se puede eliminar. Venta no encontrada con ID: " + id);
        }
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Filtros por Cliente y Estado
    @GetMapping("/cliente/{clienteId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public List<Venta> buscarPorCliente(@PathVariable Long clienteId) {
        return service.buscarPorCliente(clienteId);
    }

    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public List<Venta> buscarPorEstado(@PathVariable String estado) {
        return service.buscarPorEstado(estado);
    }
}

