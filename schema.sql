-- Script SQL para creación de Base de Datos y Tablas en MySQL / phpMyAdmin (XAMPP)
-- Proyecto: Sistema de Gestión de Residuos Electrónicos del Campus (ODS 09)
-- Grupo 07 - Soluciones Web y Aplicaciones Distribuidas

CREATE DATABASE IF NOT EXISTS `raee_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `raee_db`;

-- 1. Tabla Categorias
CREATE TABLE IF NOT EXISTS `categorias` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL UNIQUE,
    `descripcion` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabla Productos (Equipos Electrónicos / RAEE)
CREATE TABLE IF NOT EXISTS `productos` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL,
    `marca` VARCHAR(255),
    `modelo` VARCHAR(255),
    `estado` VARCHAR(50) DEFAULT 'RECIBIDO',
    `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `categoria_id` BIGINT,
    CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla Clientes
CREATE TABLE IF NOT EXISTS `clientes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL,
    `identificacion` VARCHAR(50),
    `email` VARCHAR(100),
    `telefono` VARCHAR(50),
    `tipo` VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos iniciales de prueba (Opcional)
INSERT IGNORE INTO `categorias` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Cómputo', 'Computadoras, laptops, servidores y mainboards'),
(2, 'Redes', 'Routers, switches, access points y cables estructurados'),
(3, 'Periféricos', 'Monitores, teclados, mouses e impresoras');
