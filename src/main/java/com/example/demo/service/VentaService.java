package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.DetalleVenta;
import com.example.demo.entity.Venta;
import com.example.demo.repository.VentaRepository;

@Service
public class VentaService {

    @Autowired
    private VentaRepository repository;

    public List<Venta> listar() {
        return repository.findAll();
    }

    public Venta buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Transactional
    public Venta guardar(Venta venta) {
        // Enlazar bidireccionalmente cada detalle con la venta padre
        if (venta.getDetalles() != null) {
            double totalCalculado = 0.0;
            for (DetalleVenta detalle : venta.getDetalles()) {
                detalle.setVenta(venta);
                if (detalle.getPrecioUnitario() != null && detalle.getCantidad() != null) {
                    detalle.setSubtotal(detalle.getPrecioUnitario() * detalle.getCantidad());
                    totalCalculado += detalle.getSubtotal();
                }
            }
            if (venta.getTotal() == null || venta.getTotal() == 0.0) {
                venta.setTotal(totalCalculado);
            }
        }
        return repository.save(venta);
    }

    @Transactional
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public List<Venta> buscarPorCliente(Long clienteId) {
        return repository.buscarPorCliente(clienteId);
    }

    public List<Venta> buscarPorEstado(String estado) {
        return repository.buscarPorEstado(estado);
    }
}

