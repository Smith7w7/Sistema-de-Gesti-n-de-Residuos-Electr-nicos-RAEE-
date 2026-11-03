package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Producto;
import com.example.demo.repository.ProductoRepository;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository repository;

    public List<Producto> listar() {
        return repository.findAll();
    }

    public Producto guardar(Producto producto) {
        return repository.save(producto);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public Producto buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Producto> buscarPorEstado(String estado) {
        return repository.buscarPorEstado(estado);
    }

    public List<Producto> buscarPorCategoria(String nombreCat) {
        return repository.buscarPorCategoria(nombreCat);
    }

    public List<Producto> buscarPorEstadoYMarca(String estado, String marca) {
        return repository.buscarPorEstadoYMarca(estado, marca);
    }

    public List<Producto> buscarPorRangoPrecio(Double min, Double max) {
        return repository.buscarPorRangoPrecio(min, max);
    }
}
