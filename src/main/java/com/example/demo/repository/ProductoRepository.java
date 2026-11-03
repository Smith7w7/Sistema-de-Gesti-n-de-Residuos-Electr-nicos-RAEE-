package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query("SELECT p FROM Producto p WHERE p.estado = :estado")
    List<Producto> buscarPorEstado(@Param("estado") String estado);

    // 2. Consulta JPQL con JOIN (Buscar por nombre de Categoría)
    @Query("SELECT p FROM Producto p JOIN p.categoria c WHERE c.nombre = :nombreCat")
    List<Producto> buscarPorCategoria(@Param("nombreCat") String nombreCat);
}
