package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "productos")
@NamedQueries({
    @NamedQuery(
        name = "Producto.buscarPorEstadoYMarca",
        query = "SELECT p FROM Producto p WHERE p.estado = :estado AND p.marca = :marca"
    ),
    @NamedQuery(
        name = "Producto.buscarPorRangoPrecio",
        query = "SELECT p FROM Producto p WHERE p.precio BETWEEN :minPrecio AND :maxPrecio"
    )
})
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Column(nullable = false)
    private String nombre;

    private String marca;

    private String modelo;

    private String estado;

    @NotNull(message = "El precio es obligatorio")
    @PositiveOrZero(message = "El precio no puede ser negativo")
    private Double precio;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    @JsonIgnoreProperties("productos")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Categoria categoria;

    @PrePersist
    public void prePersist() {
        if (this.fechaRegistro == null) {
            this.fechaRegistro = LocalDateTime.now();
        }
        if (this.estado == null || this.estado.trim().isEmpty()) {
            this.estado = "RECIBIDO";
        }
        if (this.precio == null) {
            this.precio = 0.0;
        }
        if (this.stock == null) {
            this.stock = 1;
        }
    }
}
