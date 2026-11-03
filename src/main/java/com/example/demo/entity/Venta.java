package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "ventas")
@NamedQueries({
    @NamedQuery(
        name = "Venta.buscarPorCliente",
        query = "SELECT v FROM Venta v WHERE v.cliente.id = :clienteId"
    ),
    @NamedQuery(
        name = "Venta.buscarPorEstado",
        query = "SELECT v FROM Venta v WHERE v.estado = :estado"
    )
})
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_venta")
    private LocalDateTime fechaVenta;

    @PositiveOrZero(message = "El total de la venta no puede ser negativo")
    @Column(nullable = false)
    private Double total;

    private String estado; // EMITIDA, PAGADA, ANULADA

    @NotNull(message = "El cliente es obligatorio para registrar la venta")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @NotEmpty(message = "La venta debe incluir al menos un detalle de producto")
    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("venta")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<DetalleVenta> detalles = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (this.fechaVenta == null) {
            this.fechaVenta = LocalDateTime.now();
        }
        if (this.estado == null || this.estado.trim().isEmpty()) {
            this.estado = "EMITIDA";
        }
        if (this.total == null) {
            this.total = 0.0;
        }
    }
}

