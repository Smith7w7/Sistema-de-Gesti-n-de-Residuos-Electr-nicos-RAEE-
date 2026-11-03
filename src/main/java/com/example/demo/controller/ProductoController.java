package com.example.demo.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Producto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.service.ProductoService;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService service;

    // 1. INDEX - Listar todos los productos (Acceso: ADMIN y VENDEDOR)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public List<Producto> index() {
        return service.listar();
    }

    // 2. SHOW - Obtener detalle de un producto por ID (Acceso: ADMIN y VENDEDOR)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Producto> show(@PathVariable Long id) {
        Producto producto = service.buscarPorId(id);
        if (producto == null) {
            throw new ResourceNotFoundException("Producto no encontrado con el ID: " + id);
        }
        return ResponseEntity.ok(producto);
    }

    // 3. CREATE - Registrar nuevo producto con validaciones (Acceso: ADMIN y VENDEDOR)
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Producto> create(@Valid @RequestBody Producto producto) {
        Producto creado = service.guardar(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    // 4. UPDATE - Actualizar producto existente con validaciones (Acceso: ADMIN y VENDEDOR)
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Producto> update(@PathVariable Long id, @Valid @RequestBody Producto producto) {
        Producto existente = service.buscarPorId(id);
        if (existente == null) {
            throw new ResourceNotFoundException("No se puede actualizar. Producto no encontrado con ID: " + id);
        }
        producto.setId(id);
        Producto actualizado = service.guardar(producto);
        return ResponseEntity.ok(actualizado);
    }

    // 5. DELETE - Eliminar producto (Acceso exclusivo: ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Producto existente = service.buscarPorId(id);
        if (existente == null) {
            throw new ResourceNotFoundException("No se puede eliminar. Producto no encontrado con ID: " + id);
        }
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // --- Consultas Avanzadas y Filtros ---

    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public List<Producto> buscarPorEstado(@PathVariable String estado) {
        return service.buscarPorEstado(estado);
    }

    @GetMapping("/categoria/{nombreCat}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public List<Producto> buscarPorCategoria(@PathVariable String nombreCat) {
        return service.buscarPorCategoria(nombreCat);
    }

    @GetMapping("/buscar/estado-marca")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public List<Producto> buscarPorEstadoYMarca(@RequestParam String estado, @RequestParam String marca) {
        return service.buscarPorEstadoYMarca(estado, marca);
    }

    @GetMapping("/buscar/precio")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public List<Producto> buscarPorRangoPrecio(@RequestParam Double min, @RequestParam Double max) {
        return service.buscarPorRangoPrecio(min, max);
    }
}
