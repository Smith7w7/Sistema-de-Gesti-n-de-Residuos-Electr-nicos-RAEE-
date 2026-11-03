import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, Usuario } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('raee_auth_user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return this.currentUserValue?.token || localStorage.getItem('raee_jwt_token');
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public isAdmin(): boolean {
    return this.currentUserValue?.rol === 'ROLE_ADMIN';
  }

  public isVendedor(): boolean {
    return this.currentUserValue?.rol === 'ROLE_VENDEDOR' || this.isAdmin();
  }

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        const user: Usuario = {
          username: response.username,
          rol: response.rol,
          token: response.token,
          type: response.type
        };
        localStorage.setItem('raee_jwt_token', response.token);
        localStorage.setItem('raee_auth_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('raee_jwt_token');
    localStorage.removeItem('raee_auth_user');
    this.currentUserSubject.next(null);
  }
}

