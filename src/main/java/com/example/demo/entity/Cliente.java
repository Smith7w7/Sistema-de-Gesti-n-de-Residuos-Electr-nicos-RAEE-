package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
@Table(name = "clientes")
@NamedQueries({
    @NamedQuery(
        name = "Cliente.buscarPorIdentificacion",
        query = "SELECT c FROM Cliente c WHERE c.identificacion = :identificacion"
    ),
    @NamedQuery(
        name = "Cliente.buscarPorTipo",
        query = "SELECT c FROM Cliente c WHERE c.tipo = :tipo"
    )
})
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del cliente es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "La identificación es obligatoria")
    @Size(min = 8, max = 11, message = "La identificación debe contener entre 8 y 11 caracteres")
    @Column(unique = true, nullable = false)
    private String identificacion;

    @Email(message = "El formato de correo electrónico no es válido")
    private String email;

    @Pattern(regexp = "^[0-9+() -]*$", message = "El teléfono sólo puede contener números o guiones")
    private String telefono;

    @NotBlank(message = "El tipo de cliente es obligatorio (NATURAL o JURIDICO)")
    private String tipo;
}
