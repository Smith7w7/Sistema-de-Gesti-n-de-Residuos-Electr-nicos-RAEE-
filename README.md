# ♻️ Sistema de Gestión de Residuos Electrónicos (RAEE) y Ventas

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%20LTS-orange?logo=openjdk)](https://adoptium.net/)
[![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular)](https://angular.dev/)
[![Security](https://img.shields.io/badge/Security-Spring%20Security%20%26%20JWT-blue?logo=jsonwebtokens)](https://jwt.io/)
[![Database](https://img.shields.io/badge/Database-MySQL%20%7C%20H2%20In--Memory-blue?logo=mysql)](https://www.mysql.com/)

Proyecto integral para la recolección, clasificación técnica, diagnóstico y comercialización de residuos de aparatos eléctricos y electrónicos (**RAEE**), alineado al **Objetivo de Desarrollo Sostenible (ODS 09: Industria, Innovación e Infraestructura)** de la Universidad Privada del Norte (UPN).

---

## 📋 Tabla de Contenidos
1. [Arquitectura del Sistema](#-arquitectura-del-sistema)
2. [Requisitos Previos](#-requisitos-previos)
3. [Guía Paso a Paso para Desplegar en Otra PC](#-guía-paso-a-paso-para-desplegar-en-otra-pc)
   - [Paso 1: Clonar el Repositorio](#paso-1-clonar-el-repositorio)
   - [Paso 2: Desplegar el Backend (Spring Boot)](#paso-2-desplegar-el-backend-spring-boot)
   - [Paso 3: Desplegar el Frontend (Angular)](#paso-3-desplegar-el-frontend-angular)
4. [Credenciales de Acceso (JWT y Roles)](#-credenciales-de-acceso-jwt-y-roles)
5. [Endpoints de la API REST](#-endpoints-de-la-api-rest)
6. [Ejecución de Pruebas Automatizadas](#-ejecución-de-pruebas-automatizadas)
7. [Solución de Problemas Frecuentes](#-solución-de-problemas-frecuentes)

---

## 🏛️ Arquitectura del Sistema

El proyecto cuenta con una arquitectura desacoplada y moderna:
* **Backend:** Spring Boot 3.3.4 (Java 21) estructurado en capas (Controller, Service, Repository, Entity), asegurado con Spring Security 6 y tokens **JWT (JSON Web Token)** sin estado (*Stateless*).
* **Frontend:** Angular 18 (Standalone Components) con rutas protegidas por `AuthGuard`, inyección automática de Bearer token con `HttpInterceptorFn`, diseño reactivo con **Bootstrap 5**, Flexbox y CSS Grid.
* **Persistencia Dual:**
  * **H2 Database en memoria:** No requiere instalar nada externo, ideal para pruebas inmediatas y demostraciones.
  * **MySQL 8 (XAMPP):** Para persistencia relacional en disco.

---

## 💻 Requisitos Previos

Antes de comenzar en la nueva PC, asegúrate de tener instalado:

1. **Java Development Kit (JDK) 21:**  
   Verifica en tu terminal con:
   ```bash
   java -version
   ```
   *(Si no lo tienes, puedes descargarlo gratis desde [Eclipse Temurin JDK 21](https://adoptium.net/temurin/releases/?version=21)).*

2. **Node.js (versión 18 o 20 LTS) y npm:**  
   Verifica con:
   ```bash
   node -v
   npm -v
   ```
   *(Descárgalo desde [nodejs.org](https://nodejs.org/)).*

3. **Git:**  
   Verifica con:
   ```bash
   git --version
   ```

4. *(Opcional)* **XAMPP / MySQL:**  
   Solo si deseas usar MySQL en lugar de la base de datos en memoria H2.

---

## 🚀 Guía Paso a Paso para Desplegar en Otra PC

### Paso 1: Clonar el Repositorio

Abre una terminal (PowerShell, CMD o Git Bash) en la carpeta donde deseas guardar el proyecto:

```bash
git clone https://github.com/Smith7w7/Sistema-de-Gesti-n-de-Residuos-Electr-nicos-RAEE-.git
cd Sistema-de-Gesti-n-de-Residuos-Electr-nicos-RAEE-
```

---

### Paso 2: Desplegar el Backend (Spring Boot)

El proyecto incluye **Maven Wrapper (`mvnw.cmd`)**, por lo que **no necesitas instalar Maven manualmente**.

#### Opción A: Inicio Rápido Automático (Recomendado)
Haz doble clic en el archivo **`run.bat`** o ejecuta en tu terminal:
```cmd
.\run.bat
```
> **¿Qué hace este script?**
> - Detecta automáticamente si MySQL está activo en el puerto `3306`.
> - Si MySQL está abierto, arranca conectado a la base de datos `raee_db`.
> - Si MySQL no está encendido, arranca automáticamente con el perfil **H2** en memoria, levantando el sistema de inmediato **sin necesidad de configurar bases de datos**.

#### Opción B: Inicio Manual desde Terminal
* **Modo Autónomo H2 (Sin necesidad de XAMPP / MySQL):**
  ```powershell
  .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
  ```
  *(o también: `.\start_server.ps1`)*

* **Modo MySQL (Requiere XAMPP con MySQL iniciado):**
  1. Abre el panel de XAMPP e inicia el servicio **MySQL**.
  2. Crea la base de datos importando el script [schema.sql](schema.sql) desde phpMyAdmin o consola.
  3. Ejecuta:
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```

#### ✅ Verificación del Backend:
Una vez que la consola muestre el mensaje `Started FinalApplication in ... seconds`:
* **API REST Base:** `http://localhost:8080/api`
* **Frontend Web Integrado:** [http://localhost:8080](http://localhost:8080)
* **Consola H2 (si se usó perfil H2):** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  * **JDBC URL:** `jdbc:h2:mem:raee_db`
  * **Usuario:** `sa`
  * **Contraseña:** *(dejar vacío)*

---

### Paso 3: Desplegar el Frontend (Angular)

Abre una **segunda ventana de terminal** (mantén el backend corriendo en la primera):

1. Navega a la carpeta `frontend`:
   ```bash
   cd frontend
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo de Angular:
   ```bash
   npm start
   ```
   *(También puedes hacer doble clic directamente en el archivo `start_frontend.bat` en la raíz del proyecto).*

4. Abre tu navegador web en:  
   👉 **[http://localhost:4200](http://localhost:4200)**

---

## 🔑 Credenciales de Acceso (JWT y Roles)

El sistema precarga automáticamente dos usuarios de prueba en cada inicio de la aplicación:

| Rol | Usuario | Contraseña | Permisos en la Aplicación |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `admin123` | **Control total:** Listar, consultar por ID, registrar, modificar y **eliminar** productos, clientes y anular ventas. |
| **Vendedor** | `vendedor` | `vendedor123` | **Operativo:** Listar, registrar y actualizar inventario y clientes, y emitir ventas. *(Operaciones de eliminación bloqueadas por política RBAC)*. |

---

## 📡 Endpoints de la API REST

Todas las peticiones a endpoints bajo `/api/**` (excepto `/api/auth/**`) requieren la cabecera HTTP:  
`Authorization: Bearer <tu_token_jwt>`

### 1. Autenticación (`/api/auth`)
* `POST /api/auth/login`: Autentica credenciales y emite el token JWT.
* `POST /api/auth/register`: Registra un nuevo usuario en la base de datos.

### 2. Equipos y Productos (`/api/productos`)
* `GET /api/productos`: Lista todos los equipos en inventario.
* `GET /api/productos/{id}`: Obtiene el detalle de un equipo por su ID (*show*).
* `POST /api/productos`: Registra un nuevo equipo con validaciones (*create*).
* `PUT /api/productos/{id}`: Actualiza un equipo existente (*update*).
* `DELETE /api/productos/{id}`: Elimina un equipo *(Acceso exclusivo `ROLE_ADMIN`)*.
* `GET /api/productos/estado/{estado}`: Búsqueda JPQL por estado (`RECIBIDO`, `OPERATIVO`, `EN_MANTENIMIENTO`).
* `GET /api/productos/buscar/estado-marca`: Consulta Named Query por estado y marca.
* `GET /api/productos/buscar/precio?min={min}&max={max}`: Named Query por rango de precios.

### 3. Clientes (`/api/clientes`)
* `GET /api/clientes`: Lista de personas naturales y jurídicas.
* `GET /api/clientes/{id}`: Detalle de cliente por ID.
* `POST /api/clientes`: Registrar cliente (Valida DNI de 8 dígitos o RUC de 11).
* `PUT /api/clientes/{id}`: Actualizar cliente.
* `DELETE /api/clientes/{id}`: Eliminar cliente *(Sólo `ROLE_ADMIN`)*.
* `GET /api/clientes/identificacion/{doc}`: Búsqueda por documento mediante Named Query segura.

### 4. Ventas y Órdenes de Salida (`/api/ventas`)
* `GET /api/ventas`: Historial de ventas emitidas con sus detalles en cascada.
* `GET /api/ventas/{id}`: Detalle de una orden de venta.
* `POST /api/ventas`: Registra una nueva venta con cliente y múltiples ítems.
* `DELETE /api/ventas/{id}`: Anula una orden de venta *(Sólo `ROLE_ADMIN`)*.

---

## 🧪 Ejecución de Pruebas Automatizadas

El proyecto cuenta con una cobertura integral de pruebas unitarias, de integración y de seguridad:

### 1. Pruebas Unitarias e Integrales de Spring Boot (JUnit 5 + MockMvc)
Ejecuta en la raíz del proyecto:
```powershell
.\mvnw.cmd test
```
*Se ejecutarán las 10 pruebas automatizadas validando: contexto de aplicación, CRUD de entidades, relaciones JPA en cascada, emisión y validación de tokens JWT, captura de errores 400 por Bean Validation y denegación 403 por rol insuficiente.*

### 2. Pruebas de API en Vivo vía Script PowerShell
Con el servidor Spring Boot corriendo en el puerto `8080`, abre otra terminal y ejecuta:
```powershell
.\test_api.ps1
```
*Este script simula automáticamente el flujo completo: intento de acceso no autorizado (403), login de Admin, alta de equipo, consulta, actualización, intento de eliminación denegado como Vendedor (403) y eliminación exitosa como Admin (204).*

---

## ❓ Solución de Problemas Frecuentes

### 1. "El puerto 8080 ya está en uso"
Si otra aplicación utiliza el puerto 8080:
* Abre [application.properties](src/main/resources/application.properties) y [application-h2.properties](src/main/resources/application-h2.properties).
* Modifica la línea: `server.port=8081` (o el puerto disponible que desees).
* En el frontend Angular, actualiza la URL base del servicio correspondiente.

### 2. "JAVA_HOME no está configurado"
Si al ejecutar `run.bat` o `mvnw` aparece error de variable de entorno:
1. Asegúrate de tener JDK 21 instalado.
2. Configura tu variable de entorno del sistema `JAVA_HOME` apuntando al directorio raíz de tu JDK (por ejemplo: `C:\Program Files\Eclipse Adoptium\jdk-21...`).

### 3. "Error: Configuration 'development' is not set in the workspace"
Este inconveniente ya fue resuelto en la configuración de [angular.json](frontend/angular.json). Si alguna vez clonaste una versión previa, ejecuta `git pull origin main` para tener los últimos cambios.

### 4. Permisos de ejecución de scripts en PowerShell
Si PowerShell bloquea la ejecución de scripts (`.ps1`), habilita la ejecución local temporalmente con:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

## 👥 Autores y Créditos
* **Institución:** Universidad Privada del Norte (UPN)
* **Curso:** Soluciones Web y Aplicaciones Distribuidas
* **Objetivo:** ODS 09 - Gestión Integral y Trazabilidad de Residuos RAEE
