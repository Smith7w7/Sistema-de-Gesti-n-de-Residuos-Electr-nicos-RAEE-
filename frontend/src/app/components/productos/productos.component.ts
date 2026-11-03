import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">Inventario de Equipos (RAEE)</h2>
          <p class="text-muted mb-0">Control de dispositivos, diagnóstico operativo y stock.</p>
        </div>
        <!-- Botón con Event Binding (click) -->
        <button class="btn btn-primary d-flex align-items-center gap-2" (click)="nuevoRegistro()">
          <i class="bi bi-plus-circle"></i> Nuevo Equipo
        </button>
      </div>

      <!-- Barra de Filtros con Two-way Binding [(ngModel)] e Interpolación -->
      <div class="custom-card mb-4">
        <div class="card-body p-3">
          <div class="row g-2 align-items-center">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Buscar por nombre, marca o modelo..."
                  [(ngModel)]="filtroTexto"
                  (input)="filtrar()"
                />
              </div>
            </div>
            <div class="col-md-4">
              <select class="form-select" [(ngModel)]="filtroEstado" (change)="filtrar()">
                <option value="">Todos los Estados</option>
                <option value="RECIBIDO">RECIBIDO (Por diagnosticar)</option>
                <option value="OPERATIVO">OPERATIVO (Listo para venta/reuso)</option>
                <option value="EN_MANTENIMIENTO">EN MANTENIMIENTO</option>
                <option value="BAJA">DADO DE BAJA</option>
              </select>
            </div>
            <div class="col-md-2 text-end text-muted small">
              Total: <strong>{{ productosFiltrados.length }}</strong> registros
            </div>
          </div>
        </div>
      </div>

      <!-- Alerta de Notificación con Directiva *ngIf -->
      <div class="alert alert-success alert-dismissible fade show" *ngIf="mensajeExito">
        <i class="bi bi-check-circle-fill me-2"></i>{{ mensajeExito }}
        <button type="button" class="btn-close" (click)="mensajeExito = ''"></button>
      </div>

      <!-- Tabla de Productos con Directivas *ngFor y Property Binding -->
      <div class="custom-card">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Equipo / Nombre</th>
                <th>Marca / Modelo</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th class="text-end">Precio</th>
                <th class="text-center">Stock</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <!-- Directiva *ngFor para iterar la lista -->
              <tr *ngFor="let p of productosFiltrados" [class.table-warning]="p.stock === 0">
                <td><span class="text-muted small">#{{ p.id }}</span></td>
                <td>
                  <div class="fw-semibold">{{ p.nombre }}</div>
                  <div class="text-muted small">{{ p.fechaRegistro | date:'dd/MM/yyyy HH:mm' }}</div>
                </td>
                <td>{{ p.marca || '-' }} / {{ p.modelo || '-' }}</td>
                <td>
                  <span class="badge bg-light text-dark border">{{ p.categoria?.nombre || 'General' }}</span>
                </td>
                <td>
                  <!-- Property Binding en [ngClass] -->
                  <span class="badge" [ngClass]="{
                    'badge-recibido': p.estado === 'RECIBIDO',
                    'badge-operativo': p.estado === 'OPERATIVO',
                    'badge-mantenimiento': p.estado === 'EN_MANTENIMIENTO',
                    'bg-secondary text-white': p.estado === 'BAJA'
                  }">{{ p.estado }}</span>
                </td>
                <td class="text-end fw-semibold text-primary">
                  {{ p.precio | currency:'PEN':'S/. ' }}
                </td>
                <td class="text-center">
                  <span class="badge rounded-pill" [class.bg-danger]="p.stock === 0" [class.bg-success]="p.stock > 0">
                    {{ p.stock }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary" (click)="editar(p)" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <!-- Restricción por rol: Solo ADMIN puede eliminar con *ngIf -->
                    <button
                      *ngIf="authService.isAdmin()"
                      class="btn btn-outline-danger"
                      (click)="eliminar(p.id!)"
                      title="Eliminar (Sólo Admin)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="productosFiltrados.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  No se encontraron equipos registrados con los criterios seleccionados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de Registro / Edición con Directiva *ngIf -->
      <div class="modal-backdrop fade show" *ngIf="mostrarModal"></div>
      <div class="modal fade show d-block" *ngIf="mostrarModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-dark text-white">
              <h5 class="modal-title">
                {{ productoForm.id ? 'Editar Equipo RAEE' : 'Nuevo Registro de Equipo' }}
              </h5>
              <button type="button" class="btn-close btn-close-white" (click)="mostrarModal = false"></button>
            </div>
            <form #prodForm="ngForm" (ngSubmit)="guardar(prodForm)">
              <div class="modal-body p-4">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Nombre del Dispositivo *</label>
                  <input
                    type="text"
                    class="form-control"
                    name="nombre"
                    [(ngModel)]="productoForm.nombre"
                    required
                    #nombre="ngModel"
                    [class.is-invalid]="nombre.invalid && nombre.touched"
                    placeholder="Ej: Switch Cisco 24 Puertos"
                  />
                  <div class="invalid-feedback">El nombre es requerido</div>
                </div>

                <div class="row g-2 mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Marca</label>
                    <input type="text" class="form-control" name="marca" [(ngModel)]="productoForm.marca" placeholder="Ej: Cisco" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Modelo</label>
                    <input type="text" class="form-control" name="modelo" [(ngModel)]="productoForm.modelo" placeholder="Ej: SG250" />
                  </div>
                </div>

                <div class="row g-2 mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Precio (S/.) *</label>
                    <input
                      type="number"
                      class="form-control"
                      name="precio"
                      [(ngModel)]="productoForm.precio"
                      required
                      min="0"
                      #precio="ngModel"
                      [class.is-invalid]="precio.invalid && precio.touched"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Stock *</label>
                    <input
                      type="number"
                      class="form-control"
                      name="stock"
                      [(ngModel)]="productoForm.stock"
                      required
                      min="0"
                      #stock="ngModel"
                      [class.is-invalid]="stock.invalid && stock.touched"
                    />
                  </div>
                </div>

                <div class="row g-2">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Estado</label>
                    <select class="form-select" name="estado" [(ngModel)]="productoForm.estado">
                      <option value="RECIBIDO">RECIBIDO</option>
                      <option value="OPERATIVO">OPERATIVO</option>
                      <option value="EN_MANTENIMIENTO">EN_MANTENIMIENTO</option>
                      <option value="BAJA">BAJA</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Categoría</label>
                    <select class="form-select" name="categoria" [(ngModel)]="categoriaSeleccionadaId">
                      <option [ngValue]="null">Sin Categoría</option>
                      <option *ngFor="let c of categorias" [value]="c.id">{{ c.nombre }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary" (click)="mostrarModal = false">Cancelar</button>
                <!-- Property Binding en disabled -->
                <button type="submit" class="btn btn-success px-4" [disabled]="prodForm.invalid">
                  {{ productoForm.id ? 'Actualizar' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];

  filtroTexto = '';
  filtroEstado = '';
  mensajeExito = '';
  mostrarModal = false;

  productoForm: Producto = { nombre: '', precio: 0, stock: 1, estado: 'RECIBIDO' };
  categoriaSeleccionadaId: number | null = null;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
        this.filtrar();
      }
    });

    this.categoriaService.listar().subscribe({
      next: (cats) => { this.categorias = cats; }
    });
  }

  filtrar(): void {
    this.productosFiltrados = this.productos.filter(p => {
      const matchTexto = !this.filtroTexto ||
        p.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        (p.marca && p.marca.toLowerCase().includes(this.filtroTexto.toLowerCase())) ||
        (p.modelo && p.modelo.toLowerCase().includes(this.filtroTexto.toLowerCase()));

      const matchEstado = !this.filtroEstado || p.estado === this.filtroEstado;
      return matchTexto && matchEstado;
    });
  }

  nuevoRegistro(): void {
    this.productoForm = { nombre: '', precio: 0, stock: 1, estado: 'RECIBIDO' };
    this.categoriaSeleccionadaId = null;
    this.mostrarModal = true;
  }

  editar(producto: Producto): void {
    this.productoForm = { ...producto };
    this.categoriaSeleccionadaId = producto.categoria?.id || null;
    this.mostrarModal = true;
  }

  guardar(form: NgForm): void {
    if (form.invalid) return;

    if (this.categoriaSeleccionadaId) {
      const cat = this.categorias.find(c => c.id === Number(this.categoriaSeleccionadaId));
      this.productoForm.categoria = cat;
    } else {
      this.productoForm.categoria = undefined;
    }

    if (this.productoForm.id) {
      this.productoService.actualizar(this.productoForm.id, this.productoForm).subscribe({
        next: () => {
          this.mensajeExito = 'Equipo actualizado exitosamente';
          this.mostrarModal = false;
          this.cargarDatos();
        }
      });
    } else {
      this.productoService.crear(this.productoForm).subscribe({
        next: () => {
          this.mensajeExito = 'Equipo registrado exitosamente';
          this.mostrarModal = false;
          this.cargarDatos();
        }
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Está seguro de eliminar este equipo del inventario?')) {
      this.productoService.eliminar(id).subscribe({
        next: () => {
          this.mensajeExito = 'Equipo eliminado correctamente';
          this.cargarDatos();
        }
      });
    }
  }
}

