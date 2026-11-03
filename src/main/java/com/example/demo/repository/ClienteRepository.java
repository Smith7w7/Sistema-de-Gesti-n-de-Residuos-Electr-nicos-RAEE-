package com.example.demo.repository;

import com.example.demo.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // 1. Ejecuta @NamedQuery Cliente.buscarPorIdentificacion con parámetro seguro
    Optional<Cliente> buscarPorIdentificacion(@Param("identificacion") String identificacion);

    // 2. Ejecuta @NamedQuery Cliente.buscarPorTipo con parámetro seguro
    List<Cliente> buscarPorTipo(@Param("tipo") String tipo);

    // 3. Consulta JPQL directa con parámetro seguro :email
    @Query("SELECT c FROM Cliente c WHERE LOWER(c.email) = LOWER(:email)")
    Optional<Cliente> buscarPorEmail(@Param("email") String email);
}
