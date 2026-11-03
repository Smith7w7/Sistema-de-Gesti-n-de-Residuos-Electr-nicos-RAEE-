import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../core/services/auth.service';
import { Venta, DetalleVenta } from '../../models/venta.model';
import { Cliente } from '../../models/cliente.model';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">Módulo de Ventas y Disposición</h2>
          <p class="text-muted mb-0">Emisión de órdenes de salida y comercialización de equipos/piezas.</p>
        </div>
        <button class="btn btn-outline-primary" (click)="toggleModoRegistro()">
          <i class="bi" [ngClass]="mostrarFormulario ? 'bi-list-ul' : 'bi-cart-plus'"></i>
          {{ mostrarFormulario ? 'Ver Historial de Ventas' : 'Nueva Venta' }}
        </button>
      </div>

      <!-- Alertas con *ngIf -->
      <div class="alert alert-success alert-dismissible fade show" *ngIf="mensajeExito">
        <i class="bi bi-check-circle-fill me-2"></i>{{ mensajeExito }}
        <button type="button" class="btn-close" (click)="mensajeExito = ''"></button>
      </div>
      <div class="alert alert-danger" *ngIf="mensajeError">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ mensajeError }}
      </div>

      <!-- SECCIÓN 1: FORMULARIO DE NUEVA VENTA (CON CARRITO) -->
      <div class="row g-4" *ngIf="mostrarFormulario">
        <div class="col-lg-5">
          <div class="custom-card">
            <div class="card-header bg-light">
              <h5 class="mb-0"><i class="bi bi-cart4 text-success me-2"></i>Agregar Ítems a la Venta</h5>
            </div>
            <div class="card-body">
              <!-- Selección de Cliente -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Seleccionar Cliente *</label>
                <select class="form-select" [(ngModel)]="clienteSeleccionadoId">
                  <option [ngValue]="null">-- Seleccione Cliente --</option>
                  <option *ngFor="let c of clientes" [value]="c.id">
                    {{ c.nombre }} ({{ c.identificacion }})
                  </option>
                </select>
              </div>

              <!-- Selección de Producto -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Seleccionar Producto / Equipo *</label>
                <select class="form-select" [(ngModel)]="productoSeleccionadoId" (change)="onProductoChange()">
                  <option [ngValue]="null">-- Seleccione Producto --</option>
                  <option *ngFor="let p of productos" [value]="p.id" [disabled]="p.stock === 0">
                    {{ p.nombre }} - {{ p.precio | currency:'PEN':'S/. ' }} (Stock: {{ p.stock }})
                  </option>
                </select>
              </div>

              <!-- Cantidad y Subtotal -->
              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label fw-semibold">Cantidad</label>
                  <input
                    type="number"
                    class="form-control"
                    [(ngModel)]="cantidadItem"
                    min="1"
                    [max]="productoSeleccionado?.stock || 99"
                  />
                </div>
                <div class="col-6">
                  <label class="form-label fw-semibold">Precio Unitario</label>
                  <input
                    type="text"
                    class="form-control bg-light"
                    readonly
                    [value]="(productoSeleccionado?.precio || 0) | currency:'PEN':'S/. '"
                  />
                </div>
              </div>

              <button
                class="btn btn-outline-success w-100"
                (click)="agregarAlCarrito()"
                [disabled]="!productoSeleccionadoId || cantidadItem <= 0"
              >
                <i class="bi bi-plus-lg me-1"></i>Agregar al Detalle
              </button>
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="custom-card">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi bi-receipt me-2"></i>Resumen de la Orden de Salida</h5>
              <span class="badge bg-primary">{{ carrito.length }} ítems</span>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Producto</th>
                      <th class="text-center">Cant.</th>
                      <th class="text-end">P. Unitario</th>
                      <th class="text-end">Subtotal</th>
                      <th class="text-center">Quitar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of carrito; let i = index">
                      <td>
                        <div class="fw-semibold">{{ item.producto.nombre }}</div>
                        <small class="text-muted">{{ item.producto.marca }}</small>
                      </td>
                      <td class="text-center">{{ item.cantidad }}</td>
                      <td class="text-end">{{ item.precioUnitario | currency:'PEN':'S/. ' }}</td>
                      <td class="text-end fw-bold text-success">{{ item.subtotal | currency:'PEN':'S/. ' }}</td>
                      <td class="text-center">
                        <button class="btn btn-sm btn-link text-danger p-0" (click)="quitarItem(i)">
                          <i class="bi bi-x-circle fs-5"></i>
                        </button>
                      </td>
                    </tr>
                    <tr *ngIf="carrito.length === 0">
                      <td colspan="5" class="text-center py-4 text-muted">
                        No hay productos en la orden de venta actual.
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="table-light" *ngIf="carrito.length > 0">
                    <tr>
                      <th colspan="3" class="text-end fs-5">Total a Pagar:</th>
                      <th class="text-end fs-5 text-primary">{{ calcularTotal() | currency:'PEN':'S/. ' }}</th>
                      <th></th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div class="card-footer bg-white p-3 text-end">
              <button
                class="btn btn-success px-4 py-2 fw-semibold"
                [disabled]="carrito.length === 0 || !clienteSeleccionadoId"
                (click)="procesarVenta()"
              >
                <i class="bi bi-check2-circle me-1"></i>Confirmar y Emitir Venta
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 2: HISTORIAL DE VENTAS EMITIDAS -->
      <div class="custom-card" *ngIf="!mostrarFormulario">
        <div class="card-header">
          <h5 class="mb-0"><i class="bi bi-clock-history me-2"></i>Historial de Transacciones Registradas</h5>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>N° Venta</th>
                <th>Fecha y Hora</th>
                <th>Cliente Asociado</th>
                <th>Ítems</th>
                <th>Estado</th>
                <th class="text-end">Total Liquidado</th>
                <th class="text-end" *ngIf="authService.isAdmin()">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of ventas">
                <td><strong>#VNT-00{{ v.id }}</strong></td>
                <td>{{ v.fechaVenta | date:'dd/MM/yyyy HH:mm:ss' }}</td>
                <td>
                  <div class="fw-semibold">{{ v.cliente.nombre }}</div>
                  <small class="text-muted">{{ v.cliente.identificacion }}</small>
                </td>
                <td>
                  <span class="badge bg-secondary-subtle text-dark border">
                    {{ v.detalles.length || 0 }} productos
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="v.estado === 'PAGADA' ? 'bg-success' : 'bg-warning text-dark'">
                    {{ v.estado }}
                  </span>
                </td>
                <td class="text-end fw-bold text-success">
                  {{ v.total | currency:'PEN':'S/. ' }}
                </td>
                <td class="text-end" *ngIf="authService.isAdmin()">
                  <button class="btn btn-outline-danger btn-sm" (click)="eliminarVenta(v.id!)" title="Anular (Admin)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="ventas.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">
                  Aún no se registran transacciones de venta en el sistema.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class VentasComponent implements OnInit {
  ventas: Venta[] = [];
  clientes: Cliente[] = [];
  productos: Producto[] = [];

  mostrarFormulario = false;
  mensajeExito = '';
  mensajeError = '';

  clienteSeleccionadoId: number | null = null;
  productoSeleccionadoId: number | null = null;
  productoSeleccionado: Producto | null = null;
  cantidadItem = 1;

  carrito: DetalleVenta[] = [];

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.ventaService.listar().subscribe({
      next: (v) => { this.ventas = v; }
    });
    this.clienteService.listar().subscribe({
      next: (c) => { this.clientes = c; }
    });
    this.productoService.listar().subscribe({
      next: (p) => { this.productos = p; }
    });
  }

  toggleModoRegistro(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (this.mostrarFormulario) {
      this.carrito = [];
      this.clienteSeleccionadoId = null;
      this.productoSeleccionadoId = null;
      this.cantidadItem = 1;
    }
  }

  onProductoChange(): void {
    if (this.productoSeleccionadoId) {
      this.productoSeleccionado = this.productos.find(p => p.id === Number(this.productoSeleccionadoId)) || null;
      this.cantidadItem = 1;
    } else {
      this.productoSeleccionado = null;
    }
  }

  agregarAlCarrito(): void {
    if (!this.productoSeleccionado) return;

    const subtotal = this.productoSeleccionado.precio * this.cantidadItem;
    this.carrito.push({
      producto: this.productoSeleccionado,
      cantidad: this.cantidadItem,
      precioUnitario: this.productoSeleccionado.precio,
      subtotal: subtotal
    });

    this.productoSeleccionadoId = null;
    this.productoSeleccionado = null;
    this.cantidadItem = 1;
  }

  quitarItem(index: number): void {
    this.carrito.splice(index, 1);
  }

  calcularTotal(): number {
    return this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
  }

  procesarVenta(): void {
    if (!this.clienteSeleccionadoId || this.carrito.length === 0) return;

    const cliente = this.clientes.find(c => c.id === Number(this.clienteSeleccionadoId));
    if (!cliente) return;

    const nuevaVenta: Venta = {
      cliente: cliente,
      total: this.calcularTotal(),
      estado: 'PAGADA',
      detalles: this.carrito
    };

    this.ventaService.crear(nuevaVenta).subscribe({
      next: () => {
        this.mensajeExito = 'Venta registrada y procesada exitosamente';
        this.mostrarFormulario = false;
        this.cargarDatos();
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'Error al emitir la venta';
      }
    });
  }

  eliminarVenta(id: number): void {
    if (confirm('¿Desea anular o eliminar la venta seleccionada?')) {
      this.ventaService.eliminar(id).subscribe({
        next: () => {
          this.mensajeExito = 'Venta eliminada del registro';
          this.cargarDatos();
        }
      });
    }
  }
}

