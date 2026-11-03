-- Script SQL para creación de Base de Datos y Tablas en MySQL / phpMyAdmin (XAMPP)
-- Proyecto: Sistema de Gestión de Residuos Electrónicos (RAEE) y Ventas
-- Modelo de Entidad-Relación: Categorias, Productos, Clientes, Ventas y DetalleVentas

CREATE DATABASE IF NOT EXISTS `raee_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `raee_db`;

-- 1. Tabla Categorias
CREATE TABLE IF NOT EXISTS `categorias` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL UNIQUE,
    `descripcion` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabla Clientes
CREATE TABLE IF NOT EXISTS `clientes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL,
    `identificacion` VARCHAR(50) UNIQUE,
    `email` VARCHAR(100),
    `telefono` VARCHAR(50),
    `tipo` VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla Productos (Equipos / Bienes RAEE)
CREATE TABLE IF NOT EXISTS `productos` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL,
    `marca` VARCHAR(255),
    `modelo` VARCHAR(255),
    `estado` VARCHAR(50) DEFAULT 'RECIBIDO',
    `precio` DECIMAL(10,2) DEFAULT 0.00,
    `stock` INT DEFAULT 1,
    `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `categoria_id` BIGINT,
    CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabla Ventas / Salidas
CREATE TABLE IF NOT EXISTS `ventas` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `fecha_venta` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `estado` VARCHAR(50) DEFAULT 'EMITIDA',
    `cliente_id` BIGINT NOT NULL,
    CONSTRAINT `fk_venta_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabla Detalle de Ventas
CREATE TABLE IF NOT EXISTS `detalle_ventas` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `venta_id` BIGINT NOT NULL,
    `producto_id` BIGINT NOT NULL,
    `cantidad` INT NOT NULL,
    `precio_unitario` DECIMAL(10,2) NOT NULL,
    `subtotal` DECIMAL(10,2) NOT NULL,
    CONSTRAINT `fk_detalle_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos Semilla de Prueba
INSERT IGNORE INTO `categorias` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Cómputo', 'Computadoras, laptops, servidores y mainboards'),
(2, 'Redes', 'Routers, switches, access points y cables estructurados'),
(3, 'Periféricos', 'Monitores, teclados, mouses e impresoras');

INSERT IGNORE INTO `clientes` (`id`, `nombre`, `identificacion`, `email`, `telefono`, `tipo`) VALUES
(1, 'Carlos Mendoza', '72345678', 'carlos.mendoza@gmail.com', '987654321', 'NATURAL'),
(2, 'Tech Solutions S.A.C.', '20601234567', 'contacto@techsolutions.pe', '014234567', 'JURIDICO');

INSERT IGNORE INTO `productos` (`id`, `nombre`, `marca`, `modelo`, `estado`, `precio`, `stock`, `categoria_id`) VALUES
(1, 'Laptop HP ProBook 450 G8', 'HP', 'ProBook 450 G8', 'OPERATIVO', 1850.00, 5, 1),
(2, 'Switch Cisco Gigabit 24 Puertos', 'Cisco', 'SG250-26-K9', 'OPERATIVO', 820.00, 3, 2),
(3, 'Monitor Dell UltraSharp 24"', 'Dell', 'U2419H', 'RECIBIDO', 450.00, 8, 3);
