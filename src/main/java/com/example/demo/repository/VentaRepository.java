package com.example.demo.repository;

import com.example.demo.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    // 1. Ejecuta @NamedQuery Venta.buscarPorCliente con parámetro seguro
    List<Venta> buscarPorCliente(@Param("clienteId") Long clienteId);

    // 2. Ejecuta @NamedQuery Venta.buscarPorEstado con parámetro seguro
    List<Venta> buscarPorEstado(@Param("estado") String estado);

    // 3. Consulta JPQL directa para rango de fechas con parámetros seguros
    @Query("SELECT v FROM Venta v WHERE v.fechaVenta BETWEEN :inicio AND :fin")
    List<Venta> buscarPorRangoFechas(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
}

