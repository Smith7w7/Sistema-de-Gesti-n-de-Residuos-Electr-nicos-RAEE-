package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Cliente;
import com.example.demo.repository.ClienteRepository;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    public List<Cliente> listar() {
        return repository.findAll();
    }

    public Cliente buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Cliente guardar(Cliente cliente) {
        return repository.save(cliente);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public Optional<Cliente> buscarPorIdentificacion(String identificacion) {
        return repository.buscarPorIdentificacion(identificacion);
    }

    public List<Cliente> buscarPorTipo(String tipo) {
        return repository.buscarPorTipo(tipo);
    }

    public Optional<Cliente> buscarPorEmail(String email) {
        return repository.buscarPorEmail(email);
    }
}
