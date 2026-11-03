package com.example.demo;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.*;
import com.example.demo.repository.*;

@SpringBootTest
@ActiveProfiles("h2")
@Transactional
public class ProyectoCompletoIntegrationTest {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private VentaRepository ventaRepository;

    @Test
    @DisplayName("1. Prueba CRUD completa de Cliente")
    public void testCrudCliente() {
        // C - CREATE
        Cliente cliente = new Cliente();
        cliente.setNombre("Ana Paredes");
        cliente.setIdentificacion("45892134");
        cliente.setEmail("ana.paredes@empresa.com");
        cliente.setTelefono("954123987");
        cliente.setTipo("NATURAL");
        Cliente guardado = clienteRepository.save(cliente);

        assertNotNull(guardado.getId());
        assertEquals("Ana Paredes", guardado.getNombre());

        // R - READ (Búsqueda por ID y por Named Query)
        Optional<Cliente> encontrado = clienteRepository.findById(guardado.getId());
        assertTrue(encontrado.isPresent());

        Optional<Cliente> porDoc = clienteRepository.buscarPorIdentificacion("45892134");
        assertTrue(porDoc.isPresent());
        assertEquals("Ana Paredes", porDoc.get().getNombre());

        // U - UPDATE
        guardado.setTelefono("999888777");
        Cliente actualizado = clienteRepository.save(guardado);
        assertEquals("999888777", actualizado.getTelefono());

        // D - DELETE
        clienteRepository.deleteById(actualizado.getId());
        Optional<Cliente> eliminado = clienteRepository.findById(actualizado.getId());
        assertFalse(eliminado.isPresent());
    }

    @Test
    @DisplayName("2. Prueba CRUD completa de Producto y JPQL / Named Queries")
    public void testCrudProductoYConsultasSeguras() {
        // Categoría previa
        Categoria cat = new Categoria();
        cat.setNombre("Servidores");
        cat.setDescripcion("Equipos rackeables de cómputo empresarial");
        Categoria catGuardada = categoriaRepository.save(cat);

        // C - CREATE
        Producto prod = new Producto();
        prod.setNombre("Servidor PowerEdge R740");
        prod.setMarca("Dell");
        prod.setModelo("R740");
        prod.setEstado("OPERATIVO");
        prod.setPrecio(4500.0);
        prod.setStock(2);
        prod.setCategoria(catGuardada);

        Producto guardado = productoRepository.save(prod);
        assertNotNull(guardado.getId());

        // R - READ (JPQL y Named Queries con parámetros seguros)
        List<Producto> porEstado = productoRepository.buscarPorEstado("OPERATIVO");
        assertFalse(porEstado.isEmpty());

        List<Producto> porCat = productoRepository.buscarPorCategoria("Servidores");
        assertFalse(porCat.isEmpty());
        assertEquals("Servidor PowerEdge R740", porCat.get(0).getNombre());

        // Named Query con 2 parámetros seguros
        List<Producto> porEstadoYMarca = productoRepository.buscarPorEstadoYMarca("OPERATIVO", "Dell");
        assertFalse(porEstadoYMarca.isEmpty());

        // Named Query por rango de precio
        List<Producto> porRango = productoRepository.buscarPorRangoPrecio(4000.0, 5000.0);
        assertFalse(porRango.isEmpty());

        // U - UPDATE
        guardado.setEstado("EN_MANTENIMIENTO");
        guardado.setPrecio(4200.0);
        Producto modificado = productoRepository.save(guardado);
        assertEquals("EN_MANTENIMIENTO", modificado.getEstado());
        assertEquals(4200.0, modificado.getPrecio());

        // D - DELETE
        productoRepository.deleteById(modificado.getId());
        assertFalse(productoRepository.findById(modificado.getId()).isPresent());
    }

    @Test
    @DisplayName("3. Prueba de Venta con Detalle y relación con Cliente y Producto")
    public void testVentaConDetalles() {
        Cliente cli = new Cliente();
        cli.setNombre("Corporación Andina");
        cli.setIdentificacion("20109988771");
        cli.setEmail("ventas@andina.com");
        cli.setTipo("JURIDICO");
        Cliente cliGuardado = clienteRepository.save(cli);

        Producto prod = new Producto();
        prod.setNombre("Mouse Óptico Logitech");
        prod.setMarca("Logitech");
        prod.setPrecio(25.0);
        prod.setStock(50);
        Producto prodGuardado = productoRepository.save(prod);

        // Registrar Venta
        Venta venta = new Venta();
        venta.setCliente(cliGuardado);
        venta.setTotal(50.0);
        venta.setEstado("PAGADA");

        DetalleVenta detalle = new DetalleVenta();
        detalle.setVenta(venta);
        detalle.setProducto(prodGuardado);
        detalle.setCantidad(2);
        detalle.setPrecioUnitario(25.0);
        detalle.setSubtotal(50.0);

        venta.getDetalles().add(detalle);

        Venta ventaGuardada = ventaRepository.save(venta);
        assertNotNull(ventaGuardada.getId());
        assertEquals(1, ventaGuardada.getDetalles().size());

        // Buscar Venta mediante Named Query
        List<Venta> ventasCliente = ventaRepository.buscarPorCliente(cliGuardado.getId());
        assertEquals(1, ventasCliente.size());
        assertEquals("PAGADA", ventasCliente.get(0).getEstado());
    }
}

