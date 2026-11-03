package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // 1. Consulta JPQL directa con parámetro seguro :estado
    @Query("SELECT p FROM Producto p WHERE p.estado = :estado")
    List<Producto> buscarPorEstado(@Param("estado") String estado);

    // 2. Consulta JPQL con JOIN y parámetro seguro :nombreCat
    @Query("SELECT p FROM Producto p JOIN p.categoria c WHERE c.nombre = :nombreCat")
    List<Producto> buscarPorCategoria(@Param("nombreCat") String nombreCat);

    // 3. Ejecuta @NamedQuery Producto.buscarPorEstadoYMarca con parámetros seguros
    List<Producto> buscarPorEstadoYMarca(@Param("estado") String estado, @Param("marca") String marca);

    // 4. Ejecuta @NamedQuery Producto.buscarPorRangoPrecio con parámetros seguros
    List<Producto> buscarPorRangoPrecio(@Param("minPrecio") Double minPrecio, @Param("maxPrecio") Double maxPrecio);
}
