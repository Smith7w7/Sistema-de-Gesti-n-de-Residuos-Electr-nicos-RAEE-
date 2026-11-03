package com.example.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.demo.entity.Producto;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.service.ProductoService;

@ExtendWith(MockitoExtension.class)
public class ProductoServiceTest {

    @Mock
    private ProductoRepository repository;

    @InjectMocks
    private ProductoService service;

    @Test
    public void testGuardarProducto() {
        Producto producto = new Producto();
        producto.setNombre("Switch Cisco 24 Puertos");
        producto.setMarca("Cisco");
        producto.setModelo("Catalyst 2960");
        producto.setEstado("RECIBIDO");

        when(repository.save(any(Producto.class))).thenAnswer(invocation -> {
            Producto p = invocation.getArgument(0);
            p.setId(1L);
            return p;
        });

        Producto guardado = service.guardar(producto);

        assertNotNull(guardado);
        assertEquals(1L, guardado.getId());
        assertEquals("Switch Cisco 24 Puertos", guardado.getNombre());
        assertEquals("RECIBIDO", guardado.getEstado());
    }
}
