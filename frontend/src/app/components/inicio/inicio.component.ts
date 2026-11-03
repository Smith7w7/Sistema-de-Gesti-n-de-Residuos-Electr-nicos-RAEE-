import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { ClienteService } from '../../services/cliente.service';
import { VentaService } from '../../services/venta.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <!-- Header de Bienvenida con Interpolación -->
      <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 class="fw-bold mb-1">Panel Principal</h2>
          <p class="text-muted mb-0">Bienvenido/a, <strong>{{ authService.currentUserValue?.username }}</strong> ({{ authService.isAdmin() ? 'Administrador' : 'Vendedor' }})</p>
        </div>
        <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fs-6">
          <i class="bi bi-shield-check me-1"></i>Sesión Autenticada con JWT
        </span>
      </div>

      <!-- CSS Grid con KPIs de Resumen -->
      <div class="dashboard-grid">
        <div class="kpi-card">
          <div class="kpi-info">
            <h6>Total Equipos RAEE</h6>
            <h3>{{ totalProductos }}</h3>
          </div>
          <div class="kpi-icon text-success">
            <i class="bi bi-motherboard"></i>
          </div>
        </div>

        <div class="kpi-card blue">
          <div class="kpi-info">
            <h6>Clientes Registrados</h6>
            <h3>{{ totalClientes }}</h3>
          </div>
          <div class="kpi-icon text-primary">
            <i class="bi bi-people"></i>
          </div>
        </div>

        <div class="kpi-card amber">
          <div class="kpi-info">
            <h6>Equipos por Diagnosticar</h6>
            <h3>{{ pendientesCount }}</h3>
          </div>
          <div class="kpi-icon text-warning">
            <i class="bi bi-clock-history"></i>
          </div>
        </div>

        <div class="kpi-card cyan">
          <div class="kpi-info">
            <h6>Recaudación Ventas</h6>
            <h3>{{ totalVentasImporte | currency:'PEN':'S/. ' }}</h3>
          </div>
          <div class="kpi-icon text-info">
            <i class="bi bi-cash-stack"></i>
          </div>
        </div>
      </div>

      <!-- Accesos Rápidos y Objetivos ODS 09 -->
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="custom-card">
            <div class="card-header">
              <h5><i class="bi bi-lightning-charge text-warning me-2"></i>Módulos Operativos del Sistema</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-4">
                  <div class="p-3 border rounded text-center h-100 d-flex flex-column justify-content-between bg-light">
                    <div>
                      <i class="bi bi-box-seam fs-1 text-primary mb-2"></i>
                      <h6 class="fw-bold">Gestión de Equipos</h6>
                      <p class="text-muted small">Registrar, actualizar estado y dar trazabilidad a los residuos.</p>
                    </div>
                    <a routerLink="/productos" class="btn btn-outline-primary btn-sm mt-2">Ir a Productos</a>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="p-3 border rounded text-center h-100 d-flex flex-column justify-content-between bg-light">
                    <div>
                      <i class="bi bi-person-lines-fill fs-1 text-success mb-2"></i>
                      <h6 class="fw-bold">Directorio de Clientes</h6>
                      <p class="text-muted small">Personas naturales y empresas recicladoras asociadas.</p>
                    </div>
                    <a routerLink="/clientes" class="btn btn-outline-success btn-sm mt-2">Ir a Clientes</a>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="p-3 border rounded text-center h-100 d-flex flex-column justify-content-between bg-light">
                    <div>
                      <i class="bi bi-receipt-cutoff fs-1 text-info mb-2"></i>
                      <h6 class="fw-bold">Ventas y Disposición</h6>
                      <p class="text-muted small">Generar órdenes de salida y comercialización de piezas.</p>
                    </div>
                    <a routerLink="/ventas" class="btn btn-outline-info btn-sm mt-2">Ir a Ventas</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="custom-card">
            <div class="card-header">
              <h5><i class="bi bi-info-circle text-primary me-2"></i>ODS 09 - Campus Sostenible</h5>
            </div>
            <div class="card-body">
              <p class="small text-muted mb-3">
                Iniciativa universitaria para la gestión responsable y recuperación de residuos de aparatos eléctricos y electrónicos (RAEE).
              </p>
              <ul class="list-unstyled small mb-0">
                <li class="mb-2"><i class="bi bi-check2-circle text-success me-2"></i>Recuperación de piezas operativas.</li>
                <li class="mb-2"><i class="bi bi-check2-circle text-success me-2"></i>Disposición ambiental certificada.</li>
                <li><i class="bi bi-check2-circle text-success me-2"></i>Trazabilidad completa con Spring Boot y Angular.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InicioComponent implements OnInit {
  totalProductos = 0;
  totalClientes = 0;
  pendientesCount = 0;
  totalVentasImporte = 0;

  constructor(
    public authService: AuthService,
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.cargarMetricas();
  }

  cargarMetricas(): void {
    this.productoService.listar().subscribe({
      next: (prods) => {
        this.totalProductos = prods.length;
        this.pendientesCount = prods.filter(p => p.estado === 'RECIBIDO').length;
      }
    });

    this.clienteService.listar().subscribe({
      next: (clis) => {
        this.totalClientes = clis.length;
      }
    });

    this.ventaService.listar().subscribe({
      next: (ventas) => {
        this.totalVentasImporte = ventas.reduce((acc, v) => acc + (v.total || 0), 0);
      }
    });
  }
}

