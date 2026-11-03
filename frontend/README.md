# Frontend Angular - Sistema de Gestión RAEE y Ventas

Aplicación web desarrollada en **Angular 18** (Standalone Components) para la gestión integral de residuos de aparatos eléctricos y electrónicos (RAEE), clientes y emisión de órdenes de venta, comunicándose de forma segura mediante **JWT** con el backend en Spring Boot.

---

## 🚀 Requisitos Previos e Instalación

1. Asegúrate de tener instalado **Node.js** (v18 o v20+).
2. Abre una terminal en la carpeta `frontend/`:
   ```bash
   cd frontend
   npm install
   ```

---

## 💻 Ejecución del Servidor de Desarrollo

Inicia el servidor local de Angular:
```bash
npm start
# o: npx ng serve
```

Abre tu navegador en:
👉 **[http://localhost:4200](http://localhost:4200)**

---

## 🔑 Credenciales de Acceso (JWT)

| Rol | Usuario | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `admin123` | Control total: Crear, consultar, editar y **eliminar** registros. |
| **Vendedor** | `vendedor` | `vendedor123` | Operativo: Crear, consultar, actualizar productos, clientes y registrar ventas. *(Eliminación denegada)*. |

---

## 📂 Arquitectura del Proyecto Angular

```text
frontend/src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts         # Protección de rutas según token JWT
│   ├── interceptors/
│   │   └── jwt.interceptor.ts    # Inyección automática de 'Authorization: Bearer <token>'
│   └── services/
│       └── auth.service.ts       # Login, Logout y estado de sesión
├── models/
│   ├── producto.model.ts         # Modelo de datos de Equipos RAEE
│   ├── cliente.model.ts          # Modelo de Clientes
│   ├── categoria.model.ts        # Modelo de Categorías
│   ├── venta.model.ts            # Modelo de Venta y DetalleVenta
│   └── usuario.model.ts          # Interfaces de Autenticación
├── services/
│   ├── producto.service.ts       # Consumo de endpoints REST /api/productos
│   ├── cliente.service.ts        # Consumo de endpoints REST /api/clientes
│   ├── categoria.service.ts      # Consumo de endpoints REST /api/categorias
│   └── venta.service.ts          # Consumo de endpoints REST /api/ventas
└── components/
    ├── navbar/                   # Barra de navegación responsiva con indicador de Rol
    ├── login/                    # Pantalla de inicio de sesión con validaciones
    ├── inicio/                   # Dashboard interactivo con KPIs (Grid y Flexbox)
    ├── productos/                # Tabla CRUD de equipos, badges y filtros reactivos
    ├── clientes/                 # Catálogo de clientes con validación DNI/RUC
    └── ventas/                   # Módulo de ventas con carrito dinámico y totales
```

---

## 🎨 Características de Frontend Aplicadas

- **Interpolación:** Visualización dinámica de datos (`{{ p.nombre }}`, `{{ total | currency }}`).
- **Property Binding:** Enlace a propiedades HTML (`[disabled]="form.invalid"`, `[class.table-warning]="p.stock === 0"`).
- **Event Binding:** Captura de acciones del usuario (`(click)="eliminar(p.id)"`, `(ngSubmit)="guardar()"`).
- **Two-way Data Binding:** Sincronización bidireccional mediante `[(ngModel)]`.
- **Directivas:** Estructurales (`*ngIf`, `*ngFor`) y de atributo (`[ngClass]`).
- **Diseño Responsivo:** Bootstrap 5, Flexbox, CSS Grid y SASS moderno.

