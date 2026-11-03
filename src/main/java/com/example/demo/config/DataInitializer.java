package com.example.demo.config;

import com.example.demo.entity.Rol;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Inicializar Usuario Administrador por defecto
        if (!usuarioRepository.existsByUsername("admin")) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@raee.com");
            admin.setRol(Rol.ROLE_ADMIN);
            admin.setActivo(true);
            usuarioRepository.save(admin);
            System.out.println(">>> [SECURITY] Usuario Administrador inicializado: admin / admin123");
        }

        // Inicializar Usuario Vendedor por defecto
        if (!usuarioRepository.existsByUsername("vendedor")) {
            Usuario vendedor = new Usuario();
            vendedor.setUsername("vendedor");
            vendedor.setPassword(passwordEncoder.encode("vendedor123"));
            vendedor.setEmail("vendedor@raee.com");
            vendedor.setRol(Rol.ROLE_VENDEDOR);
            vendedor.setActivo(true);
            usuarioRepository.save(vendedor);
            System.out.println(">>> [SECURITY] Usuario Vendedor inicializado: vendedor / vendedor123");
        }
    }
}
