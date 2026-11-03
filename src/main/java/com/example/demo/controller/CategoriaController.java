package com.example.demo.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Categoria;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.service.CategoriaService;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService service;

    // 1. INDEX
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public List<Categoria> index() {
        return service.listar();
    }

    // 2. SHOW
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Categoria> show(@PathVariable Long id) {
        Categoria cat = service.buscarPorId(id);
        if (cat == null) {
            throw new ResourceNotFoundException("Categoría no encontrada con ID: " + id);
        }
        return ResponseEntity.ok(cat);
    }

    // 3. CREATE
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Categoria> create(@Valid @RequestBody Categoria categoria) {
        Categoria creada = service.guardar(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    // 4. UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Categoria> update(@PathVariable Long id, @Valid @RequestBody Categoria categoria) {
        Categoria existente = service.buscarPorId(id);
        if (existente == null) {
            throw new ResourceNotFoundException("Categoría no encontrada con ID: " + id);
        }
        categoria.setId(id);
        Categoria actualizada = service.guardar(categoria);
        return ResponseEntity.ok(actualizada);
    }

    // 5. DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Categoria existente = service.buscarPorId(id);
        if (existente == null) {
            throw new ResourceNotFoundException("Categoría no encontrada con ID: " + id);
        }
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
