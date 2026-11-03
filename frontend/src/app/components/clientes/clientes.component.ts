import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../core/services/auth.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">Directorio de Clientes</h2>
          <p class="text-muted mb-0">Gestión de personas naturales y empresas aliadas.</p>
        </div>
        <button class="btn btn-success d-flex align-items-center gap-2" (click)="nuevoRegistro()">
          <i class="bi bi-person-plus"></i> Registrar Cliente
        </button>
      </div>

      <!-- Alerta de Notificación con *ngIf -->
      <div class="alert alert-success alert-dismissible fade show" *ngIf="mensajeExito">
        <i class="bi bi-check-circle-fill me-2"></i>{{ mensajeExito }}
        <button type="button" class="btn-close" (click)="mensajeExito = ''"></button>
      </div>

      <!-- Tabla de Clientes con *ngFor y Property Binding -->
      <div class="custom-card">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre / Razón Social</th>
                <th>DNI / RUC</th>
                <th>Tipo</th>
                <th>Contacto (Email / Tel.)</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of clientes">
                <td><span class="text-muted small">#{{ c.id }}</span></td>
                <td>
                  <div class="fw-semibold">{{ c.nombre }}</div>
                </td>
                <td><code>{{ c.identificacion }}</code></td>
                <td>
                  <span class="badge" [ngClass]="c.tipo === 'NATURAL' ? 'bg-primary' : 'bg-info text-dark'">
                    {{ c.tipo }}
                  </span>
                </td>
                <td>
                  <div class="small"><i class="bi bi-envelope me-1 text-muted"></i>{{ c.email || 'Sin correo' }}</div>
                  <div class="small text-muted"><i class="bi bi-telephone me-1"></i>{{ c.telefono || 'Sin teléfono' }}</div>
                </td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary" (click)="editar(c)" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      *ngIf="authService.isAdmin()"
                      class="btn btn-outline-danger"
                      (click)="eliminar(c.id!)"
                      title="Eliminar (Sólo Admin)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="clientes.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  No hay clientes registrados actualmente.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal con Formulario Reactivo / Template Driven -->
      <div class="modal-backdrop fade show" *ngIf="mostrarModal"></div>
      <div class="modal fade show d-block" *ngIf="mostrarModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-dark text-white">
              <h5 class="modal-title">
                {{ clienteForm.id ? 'Editar Cliente' : 'Registrar Nuevo Cliente' }}
              </h5>
              <button type="button" class="btn-close btn-close-white" (click)="mostrarModal = false"></button>
            </div>
            <form #cliForm="ngForm" (ngSubmit)="guardar(cliForm)">
              <div class="modal-body p-4">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Nombre Completo o Razón Social *</label>
                  <input
                    type="text"
                    class="form-control"
                    name="nombre"
                    [(ngModel)]="clienteForm.nombre"
                    required
                    #nombre="ngModel"
                    [class.is-invalid]="nombre.invalid && nombre.touched"
                    placeholder="Ej: Carlos Mendoza o Tech SAC"
                  />
                  <div class="invalid-feedback">El nombre es obligatorio</div>
                </div>

                <div class="row g-2 mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">DNI / RUC (8-11 dígitos) *</label>
                    <input
                      type="text"
                      class="form-control"
                      name="identificacion"
                      [(ngModel)]="clienteForm.identificacion"
                      required
                      minlength="8"
                      maxlength="11"
                      #identificacion="ngModel"
                      [class.is-invalid]="identificacion.invalid && identificacion.touched"
                      placeholder="Ej: 72345678"
                    />
                    <div class="invalid-feedback">Debe tener entre 8 y 11 dígitos</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Tipo de Cliente</label>
                    <select class="form-select" name="tipo" [(ngModel)]="clienteForm.tipo">
                      <option value="NATURAL">Persona Natural</option>
                      <option value="JURIDICO">Persona Jurídica (Empresa)</option>
                    </select>
                  </div>
                </div>

                <div class="row g-2">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Correo Electrónico</label>
                    <input
                      type="email"
                      class="form-control"
                      name="email"
                      [(ngModel)]="clienteForm.email"
                      email
                      #email="ngModel"
                      [class.is-invalid]="email.invalid && email.touched"
                      placeholder="nombre@empresa.com"
                    />
                    <div class="invalid-feedback">Formato de correo no válido</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Teléfono</label>
                    <input
                      type="text"
                      class="form-control"
                      name="telefono"
                      [(ngModel)]="clienteForm.telefono"
                      placeholder="987654321"
                    />
                  </div>
                </div>
              </div>
              <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary" (click)="mostrarModal = false">Cancelar</button>
                <button type="submit" class="btn btn-success px-4" [disabled]="cliForm.invalid">
                  {{ clienteForm.id ? 'Actualizar' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  mensajeExito = '';
  mostrarModal = false;

  clienteForm: Cliente = { nombre: '', identificacion: '', tipo: 'NATURAL' };

  constructor(private clienteService: ClienteService, public authService: AuthService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.clienteService.listar().subscribe({
      next: (data) => { this.clientes = data; }
    });
  }

  nuevoRegistro(): void {
    this.clienteForm = { nombre: '', identificacion: '', tipo: 'NATURAL' };
    this.mostrarModal = true;
  }

  editar(c: Cliente): void {
    this.clienteForm = { ...c };
    this.mostrarModal = true;
  }

  guardar(form: NgForm): void {
    if (form.invalid) return;

    if (this.clienteForm.id) {
      this.clienteService.actualizar(this.clienteForm.id, this.clienteForm).subscribe({
        next: () => {
          this.mensajeExito = 'Cliente actualizado correctamente';
          this.mostrarModal = false;
          this.cargarDatos();
        }
      });
    } else {
      this.clienteService.crear(this.clienteForm).subscribe({
        next: () => {
          this.mensajeExito = 'Cliente registrado correctamente';
          this.mostrarModal = false;
          this.cargarDatos();
        }
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Desea eliminar el cliente seleccionado?')) {
      this.clienteService.eliminar(id).subscribe({
        next: () => {
          this.mensajeExito = 'Cliente eliminado exitosamente';
          this.cargarDatos();
        }
      });
    }
  }
}

