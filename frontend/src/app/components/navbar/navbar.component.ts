import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2 sticky-top shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center gap-2 fw-bold" routerLink="/inicio">
          <i class="bi bi-recycle text-success fs-4"></i>
          <span>Sistema RAEE</span>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0" *ngIf="authService.currentUser$ | async">
            <li class="nav-item">
              <a class="nav-link" routerLink="/inicio" routerLinkActive="active">
                <i class="bi bi-speedometer2 me-1"></i>Inicio
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/productos" routerLinkActive="active">
                <i class="bi bi-box-seam me-1"></i>Productos
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/clientes" routerLinkActive="active">
                <i class="bi bi-people me-1"></i>Clientes
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/ventas" routerLinkActive="active">
                <i class="bi bi-cart-check me-1"></i>Ventas
              </a>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-3" *ngIf="authService.currentUser$ | async as user; else loginBtn">
            <span class="badge rounded-pill" [ngClass]="user.rol === 'ROLE_ADMIN' ? 'bg-danger' : 'bg-primary'">
              {{ user.rol === 'ROLE_ADMIN' ? 'ADMINISTRADOR' : 'VENDEDOR' }}
            </span>
            <span class="text-light fw-medium">
              <i class="bi bi-person-circle me-1"></i>{{ user.username }}
            </span>
            <button class="btn btn-outline-danger btn-sm" (click)="logout()">
              <i class="bi bi-box-arrow-right me-1"></i>Salir
            </button>
          </div>

          <ng-template #loginBtn>
            <div class="d-flex">
              <a class="btn btn-success btn-sm px-3" routerLink="/login">
                <i class="bi bi-box-arrow-in-right me-1"></i>Iniciar Sesión
              </a>
            </div>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-link.active {
      color: #10b981 !important;
      font-weight: 600;
    }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

