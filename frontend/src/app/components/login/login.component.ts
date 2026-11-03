import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper d-flex justify-content-center align-items-center">
      <div class="card login-card shadow-lg p-4">
        <div class="text-center mb-4">
          <div class="icon-circle bg-success text-white mb-3 mx-auto">
            <i class="bi bi-shield-lock fs-2"></i>
          </div>
          <h3 class="fw-bold">Acceso al Sistema</h3>
          <p class="text-muted small">Gestión de Residuos Electrónicos (RAEE) y Ventas</p>
        </div>

        <!-- Alerta de Error Interpolada con Directiva *ngIf -->
        <div class="alert alert-danger d-flex align-items-center py-2" *ngIf="errorMessage">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{{ errorMessage }}</div>
        </div>

        <form #loginForm="ngForm" (ngSubmit)="onLogin(loginForm)">
          <!-- Campo Usuario -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Usuario</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-person"></i></span>
              <input
                type="text"
                class="form-control"
                name="username"
                [(ngModel)]="credentials.username"
                required
                placeholder="Ej: admin o vendedor"
                #userField="ngModel"
                [class.is-invalid]="userField.invalid && userField.touched"
              />
            </div>
            <div class="invalid-feedback d-block" *ngIf="userField.invalid && userField.touched">
              El usuario es requerido
            </div>
          </div>

          <!-- Campo Contraseña con Toggle de Visibilidad -->
          <div class="mb-4">
            <label class="form-label fw-semibold">Contraseña</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-key"></i></span>
              <input
                [type]="showPassword ? 'text' : 'password'"
                class="form-control"
                name="password"
                [(ngModel)]="credentials.password"
                required
                placeholder="••••••••"
                #passField="ngModel"
                [class.is-invalid]="passField.invalid && passField.touched"
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                (click)="togglePassword()"
              >
                <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
              </button>
            </div>
            <div class="invalid-feedback d-block" *ngIf="passField.invalid && passField.touched">
              La contraseña es requerida
            </div>
          </div>

          <!-- Botón con Property Binding en disabled -->
          <button
            type="submit"
            class="btn btn-success w-100 py-2 fw-semibold"
            [disabled]="loginForm.invalid || loading"
          >
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Autenticando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="card-footer bg-white border-0 text-center mt-3 pt-3 text-muted small">
          <p class="mb-1"><strong>Usuarios de Prueba precargados:</strong></p>
          <div><code>admin</code> / <code>admin123</code> (Rol Administrador)</div>
          <div><code>vendedor</code> / <code>vendedor123</code> (Rol Vendedor)</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: calc(100vh - 70px);
      padding: 2rem;
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      border-radius: 16px;
      border: 1px solid rgba(0,0,0,0.06);
    }
    .icon-circle {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(form: NgForm): void {
    if (form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Credenciales inválidas. Por favor verifique.';
      }
    });
  }
}

